const { Bookmark, User, Product, Farm } = require("../models");

class BookmarkService {
  static async addBookmark(NID, PID) {
    const user = await User.findByPk(NID);
    const product = await Product.findByPk(PID);
    if (!user) throw new Error("User not found");
    if (!product) throw new Error("Product not found");

    const [bookmark] = await Bookmark.findOrCreate({
      where: { NID, PID },
    });

    return bookmark;
  }

  static async removeBookmark(NID, PID) {
    const deleted = await Bookmark.destroy({ where: { NID, PID } });
    if (!deleted) throw new Error("Bookmark not found");
    return { message: "Bookmark removed" };
  }

  static async isBookmarked(NID, PID) {
    const bookmark = await Bookmark.findOne({ where: { NID, PID } });
    return Boolean(bookmark);
  }

  static async getBookmarksByUser(NID) {
    const bookmarks = await Bookmark.findAll({
      where: { NID },
      include: [
        {
          model: Product,
          include: [{ model: Farm, attributes: ["FID", "farmName"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return bookmarks;
  }

  static async getBookmarksByUserAndFarm(NID, FID) {
    const bookmarks = await Bookmark.findAll({
      where: { NID },
      include: [
        {
          model: Product,
          where: { FID },
          required: true,
          include: [{ model: Farm, attributes: ["FID", "farmName"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return bookmarks;
  }
}

module.exports = BookmarkService;

