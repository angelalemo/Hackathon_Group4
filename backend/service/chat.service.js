const { Chat, Message, User, Farm } = require("../models");
const { sendEmail } = require("./gmail.service");

const buildLogID = (FID, NID) => `FID-${FID}_NID-${NID}`;

// Placeholder LINE notification helper (prevent runtime error if not configured)
const sendLineMessage = async (token, userId, message) => {
  if (!token || !userId) return;
  // TODO: integrate with LINE messaging API
  console.info("LINE message skipped (integration pending):", message);
};

const ensureRoomKey = async (chatInstance) => {
  if (!chatInstance) return null;
  if (!chatInstance.roomKey) {
    chatInstance.roomKey = buildLogID(chatInstance.FID, chatInstance.NID);
    await chatInstance.save();
  }
  return chatInstance;
};

const serializeChat = async (chatInstance) => {
  const chat = await ensureRoomKey(chatInstance);
  if (!chat) return null;
  const json = chat.toJSON();
  return {
    ...json,
    chatPrimaryID: json.logID,
    roomKey: chat.roomKey,
    logID: chat.roomKey,
    lastMessageText: json.lastMessageText || "",
    lastMessageAt: json.lastMessageAt || null,
    customerUnreadCount: json.customerUnreadCount || 0,
    farmerUnreadCount: json.farmerUnreadCount || 0,
  };
};

const findChatByIdentifier = async (logID) => {
  let chat =
    (await Chat.findOne({ where: { roomKey: logID } })) ||
    (await Chat.findByPk(logID));

  return ensureRoomKey(chat);
};

const resolveFarm = async (FID) => {
  if (!FID) return null;
  return Farm.findByPk(FID);
};

class ChatService {
  // ✅ สร้างห้องแชต
  static async createChat(NID, FID) {
    const user = await User.findByPk(NID);
    const farm = await Farm.findByPk(FID);

    if (!user || !farm) throw new Error("User or Farm not found");

    // ตรวจสอบว่า user เป็น farmer และเป็นเจ้าของฟาร์มนี้หรือไม่
    if (user.type === "Farmer" && farm.NID === NID) {
      throw new Error("ไม่สามารถแชทกับร้านค้าของตัวเองได้");
    }

    const roomKey = buildLogID(FID, NID);

    let chat =
      (await Chat.findOne({ where: { roomKey } })) ||
      (await Chat.findOne({ where: { NID, FID } }));
    if (!chat) {
      chat = await Chat.create({
        roomKey,
        NID,
        FID,
        customerUnreadCount: 0,
        farmerUnreadCount: 0,
      });

      // ✅ ส่งแจ้งเตือนไป LINE ฟาร์ม
      if (farm.lineToken && farm.lineUserId) {
        const message = `📩 ผู้ใช้ใหม่ (${user.username}) เริ่มแชตกับฟาร์มของคุณ "${farm.farmName}"`;
        await sendLineMessage(farm.lineToken, farm.lineUserId, message);
      }

      // ✅ ส่งอีเมลแจ้งเตือนไปยังเจ้าของฟาร์ม
      try {
        const farmOwner = await User.findByPk(farm.NID);
        if (farmOwner && farmOwner.email) {
          const emailSubject = `📩 แชทใหม่จาก ${user.username || "ลูกค้า"}`;
          const emailBody = `สวัสดีครับ/ค่ะ

มีลูกค้าใหม่ "${user.username || "ลูกค้า"}" เริ่มแชทกับฟาร์ม "${farm.farmName}" ของคุณแล้ว

กรุณาเข้าไปตรวจสอบและตอบกลับลูกค้าได้ที่ระบบแชท

ขอบคุณครับ/ค่ะ`;

          await sendEmail(farmOwner.email, emailSubject, emailBody);
          console.log(`Email notification sent to ${farmOwner.email} for new chat`);
        }
      } catch (emailError) {
        // ไม่ให้ error ของอีเมลทำให้การสร้างแชทล้มเหลว
        console.error("Error sending email notification:", emailError);
      }
    } else if (!chat.roomKey) {
      chat.roomKey = roomKey;
      await chat.save();
    }

    return serializeChat(chat);
  }

  // ✅ ดึงห้องทั้งหมดของ user
  static async getChatsByUser(NID) {
    const chats = await Chat.findAll({
      where: { NID },
      include: [
        { model: Farm, attributes: ["FID", "farmName"] },
        { model: User, attributes: ["NID", "username"] },
      ],
    });
    return Promise.all(chats.map((chat) => serializeChat(chat)));
  }

  static async getChatsByFarm(FID) {
    const chats = await Chat.findAll({
      where: { FID },
      include: [
        { model: Farm, attributes: ["FID", "farmName"] },
        { model: User, attributes: ["NID", "username"] },
      ],
    });
    return Promise.all(chats.map((chat) => serializeChat(chat)));
  }

  // ✅ ดึงข้อความทั้งหมดในห้อง
  static async getMessages(logID) {
    let chat = await findChatByIdentifier(logID);
    if (!chat) throw new Error("Chat not found");

    const messages = await Message.findAll({
      where: { logID: chat.logID },
      include: [{ model: User, attributes: ["username", "NID"] }],
      order: [["timestamp", "ASC"]],
    });

    return messages;
  }

  // ✅ ส่งข้อความ
  static async sendMessage(logID, senderNID, messageText, image = null, fileType = null, fileName = null) {
    let chat = await findChatByIdentifier(logID);
    if (!chat) throw new Error("Chat not found");

    const sender = await User.findByPk(senderNID);
    if (!sender) throw new Error("Sender not found");

    const farm = await resolveFarm(chat.FID);
    const isCustomerSender = senderNID === chat.NID;
    const isFarmerSender = farm && senderNID === farm.NID;

    if (!isCustomerSender && !isFarmerSender) {
      throw new Error("Sender is not a participant of this chat");
    }

    // สร้างข้อความสำหรับ lastMessageText
    let lastMessagePreview = messageText || "";
    if (image && fileType) {
      if (fileType === "image") {
        lastMessagePreview = "📷 รูปภาพ" + (messageText ? `: ${messageText}` : "");
      } else if (fileType === "video") {
        lastMessagePreview = "🎥 วิดีโอ" + (messageText ? `: ${messageText}` : "");
      } else {
        lastMessagePreview = "📎 ไฟล์" + (fileName ? `: ${fileName}` : "") + (messageText ? ` - ${messageText}` : "");
      }
    }

    const message = await Message.create({
      logID: chat.logID,
      senderNID,
      messageText: messageText || "",
      image: image || null,
      fileType: fileType || null,
      fileName: fileName || null,
    });

    const now = new Date();
    const updates = {
      lastMessageText: lastMessagePreview,
      lastMessageAt: now,
    };

    if (isCustomerSender) {
      updates.farmerUnreadCount = (chat.farmerUnreadCount || 0) + 1;
    } else {
      updates.customerUnreadCount = (chat.customerUnreadCount || 0) + 1;
    }

    await chat.update(updates);

    // ✅ ส่งอีเมลแจ้งเตือนไปยังผู้รับข้อความ
    try {
      let recipient = null;
      let senderName = sender.username || "ผู้ใช้";
      let farmName = farm ? farm.farmName : "ฟาร์ม";

      if (isCustomerSender) {
        // ลูกค้าส่งข้อความ → ส่งอีเมลไปยังเจ้าของฟาร์ม
        recipient = await User.findByPk(farm.NID);
      } else if (isFarmerSender) {
        // เจ้าของฟาร์มส่งข้อความ → ส่งอีเมลไปยังลูกค้า
        recipient = await User.findByPk(chat.NID);
      }

      if (recipient && recipient.email) {
        const emailSubject = `💬 ข้อความใหม่จาก ${isCustomerSender ? senderName : farmName}`;
        const messagePreview = lastMessagePreview.length > 50 
          ? lastMessagePreview.substring(0, 50) + "..." 
          : lastMessagePreview;
        
        const emailBody = `สวัสดีครับ/ค่ะ

คุณมีข้อความใหม่จาก ${isCustomerSender ? senderName : farmName}

ข้อความ: ${messagePreview}

กรุณาเข้าไปตรวจสอบและตอบกลับได้ที่ระบบแชท

ขอบคุณครับ/ค่ะ`;

        await sendEmail(recipient.email, emailSubject, emailBody);
        console.log(`Email notification sent to ${recipient.email} for new message`);
      }
    } catch (emailError) {
      // ไม่ให้ error ของอีเมลทำให้การส่งข้อความล้มเหลว
      console.error("Error sending email notification for message:", emailError);
    }

    return message;
  }

  static async markAsRead(logID, readerNID) {
    let chat = await findChatByIdentifier(logID);
    if (!chat) throw new Error("Chat not found");

    const farm = await resolveFarm(chat.FID);
    let updates = null;

    if (readerNID === chat.NID) {
      updates = { customerUnreadCount: 0 };
    } else if (farm && readerNID === farm.NID) {
      updates = { farmerUnreadCount: 0 };
    } else {
      throw new Error("Reader is not a participant of this chat");
    }

    await chat.update(updates);
    await chat.reload();
    return serializeChat(chat);
  }

  static async getUnreadSummary({ NID, FID }) {
    if (!NID && !FID) throw new Error("Missing participant identifier");

    if (NID) {
      const chats = await Chat.findAll({ where: { NID } });
      const totalUnread = chats.reduce(
        (sum, chat) => sum + (chat.customerUnreadCount || 0),
        0
      );
      return { role: "customer", totalUnread };
    }

    const chats = await Chat.findAll({ where: { FID } });
    const totalUnread = chats.reduce(
      (sum, chat) => sum + (chat.farmerUnreadCount || 0),
      0
    );
    return { role: "farmer", totalUnread };
  }

  static async deleteChat(logID) {
    let chat = await findChatByIdentifier(logID);
    if (!chat) throw new Error("Chat not found");

    await Message.destroy({ where: { logID: chat.logID } });
    await chat.destroy();

    return { message: `Chat ${chat.roomKey} deleted` };
  }
}

ChatService.buildLogID = buildLogID;

module.exports = ChatService;