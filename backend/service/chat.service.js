const { Chat, Message, User, Farm } = require("../models");
const { sendLineMessage } = require("../utils/lineMessaging");

class ChatService {
  // ✅ สร้างห้องแชต
  static async createChat(NID, FID) {
    const user = await User.findByPk(NID);
    const farm = await Farm.findByPk(FID);

    if (!user || !farm) throw new Error("User or Farm not found");

    let chat = await Chat.findOne({ where: { NID, FID } });
    if (!chat) {
      chat = await Chat.create({ NID, FID });

      // ✅ ส่งแจ้งเตือนไป LINE ฟาร์ม
      const message = `📩 ผู้ใช้ใหม่ (${user.username}) เริ่มแชตกับฟาร์มของคุณ "${farm.farmName}"`;
      await sendLineMessage(farm.lineToken, farm.lineUserId, message);
    }

    return chat;
  }

  // ✅ ดึงห้องทั้งหมดของ user
  static async getChatsByUser(NID) {
    return await Chat.findAll({
      where: { NID },
      include: [{ model: Farm, attributes: ["FID", "farmName"] }],
    });
  }

  // ✅ ดึงข้อความทั้งหมดในห้อง
  static async getMessages(logID) {
    const chat = await Chat.findByPk(logID);
    if (!chat) throw new Error("Chat not found");

    return await Message.findAll({
      where: { logID },
      include: [{ model: User, attributes: ["username"] }],
      order: [["timestamp", "ASC"]],
    });
  }

  // ✅ ส่งข้อความ
  static async sendMessage(logID, senderNID, messageText) {
    const chat = await Chat.findByPk(logID);
    if (!chat) throw new Error("Chat not found");

    const sender = await User.findByPk(senderNID);
    if (!sender) throw new Error("Sender not found");

    const message = await Message.create({
      logID,
      senderNID,
      messageText: messageText,
    });

    // ✅ แจ้งเตือนไป LINE ฟาร์มด้วย (optional)
    const farm = await Farm.findByPk(chat.FID);
    if (farm?.lineToken && farm?.lineUserId) {
      const lineMsg = `💬 ข้อความใหม่จาก ${sender.username}: ${text}`;
      await sendLineMessage(farm.lineToken, farm.lineUserId, lineMsg);
    }

    return message;
  }

  // ✅ ลบห้อง
  static async deleteChat(logID) {
    const chat = await Chat.findByPk(logID);
    if (!chat) throw new Error("Chat not found");

    await Message.destroy({ where: { logID } });
    await chat.destroy();

    return { message: `Chat ${logID} deleted` };
  }
}

module.exports = ChatService;