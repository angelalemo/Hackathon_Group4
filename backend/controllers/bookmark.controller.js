const BookmarkService = require("../service/bookmark.service");

class BookmarkController {
  static async addBookmark(req, res) {
    try {
      const { NID, PID } = req.body;
      if (!NID || !PID) {
        return res.status(400).json({ error: "NID and PID are required" });
      }
      const bookmark = await BookmarkService.addBookmark(NID, PID);
      res.status(201).json({ message: "Bookmark added", bookmark });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async removeBookmark(req, res) {
    try {
      const { NID, PID } = req.params;
      if (!NID || !PID) {
        return res.status(400).json({ error: "NID and PID are required" });
      }
      const result = await BookmarkService.removeBookmark(NID, PID);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async checkBookmark(req, res) {
    try {
      const { NID, PID } = req.params;
      if (!NID || !PID) {
        return res.status(400).json({ error: "NID and PID are required" });
      }
      const isBookmarked = await BookmarkService.isBookmarked(NID, PID);
      res.json({ isBookmarked });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getBookmarksByUser(req, res) {
    try {
      const { NID } = req.params;
      if (!NID) {
        return res.status(400).json({ error: "NID is required" });
      }
      const bookmarks = await BookmarkService.getBookmarksByUser(NID);
      res.json(bookmarks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getBookmarksByUserAndFarm(req, res) {
    try {
      const { NID, FID } = req.params;
      if (!NID || !FID) {
        return res.status(400).json({ error: "NID and FID are required" });
      }
      const bookmarks = await BookmarkService.getBookmarksByUserAndFarm(NID, FID);
      res.json(bookmarks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BookmarkController;

