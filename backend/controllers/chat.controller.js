const ChatService = require("../service/chat.service");

class ChatController {
  static async createChat(req, res) {
    try {
      const { NID, FID } = req.body;
      const chat = await ChatService.createChat(NID, FID);
      res.status(201).json({ message: "Chat created", chat });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getChatsByUser(req, res) {
    try {
      const { NID } = req.params;
      const chats = await ChatService.getChatsByUser(NID);
      res.json(chats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getChatsByFarm(req, res) {
    try {
      const { FID } = req.params;
      const chats = await ChatService.getChatsByFarm(FID);
      res.json(chats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { logID } = req.params;
      const { readerNID } = req.body;
      if (!readerNID) {
        return res.status(400).json({ error: "readerNID is required" });
      }
      const chat = await ChatService.markAsRead(logID, readerNID);
      res.json(chat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUnreadSummary(req, res) {
    try {
      const { NID, FID } = req.query;
      const summary = await ChatService.getUnreadSummary({
        NID,
        FID,
      });
      res.json(summary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { logID } = req.params;
      const messages = await ChatService.getMessages(logID);
      res.json(messages);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { logID, senderNID, messageText, image, fileType, fileName } = req.body;
      const message = await ChatService.sendMessage(logID, senderNID, messageText, image, fileType, fileName);
      res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteChat(req, res) {
    try {
      const { logID } = req.params;
      const result = await ChatService.deleteChat(logID);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ChatController;