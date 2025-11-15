const { Product, Farm, User } = require("../models");


// ฟังก์ชันช่วยตรวจสอบรูปภาพที่อนุญาต
function validateImageFormat(image) {
  if (!image) return null;

  const isBase64 = image.startsWith("data:image/");
  const isUrl = image.startsWith("http://") || image.startsWith("https://");

  if (!isBase64 && !isUrl) {
    throw new Error("Invalid image format: must be Base64 or URL");
  }

  return image;
}


class ProductService {
  
  // 🔹 ดึงสินค้าทั้งหม
  static async getAll() {
    const products = await Product.findAll();
    return products;
  }

  // 🔹 ดึงสินค้าทั้งหมดจาก FID เดียวกัน
  static async getAllByFarm(FID) {
    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");

    const products = await Product.findAll({ where: { FID } });
    return products;
  }

  // 🔹 ดึงสินค้ารายตัวจาก PID
  static async getById(PID) {
    const product = await Product.findByPk(PID);
    if (!product) throw new Error("Product not found");
    return product;
  }

  // 🔹 สร้างสินค้าใหม่ (เฉพาะเจ้าของฟาร์ม)
  static async createProduct(userNID, data) {
    const { FID, productName, category, saleType, price, image } = data;

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");

    const user = await User.findByPk(userNID);
    if (!user) throw new Error("User not found");
    if (farm.NID !== userNID) throw new Error("Permission denied: You don't own this farm");

    const newProduct = await Product.create({
      FID,
      productName,
      category,
      saleType,
      price,
      image: validateImageFormat(image),
    });

    return newProduct;
  }

  // 🔹 แก้ไขสินค้า (เฉพาะเจ้าของฟาร์ม)
  static async updateProduct(NID, PID, data) {
    const product = await Product.findByPk(PID);
    if (!product) throw new Error("Product not found");

    const farm = await Farm.findByPk(product.FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("Permission denied: You don't own this farm");

    await product.update({
      productName: data.productName || product.productName,
      saleType: data.saleType || product.saleType,
      category: data.category || product.category,
      price: data.price || product.price,
      image: data.image ? validateImageFormat(data.image) : product.image,
    });

    return product;
  }

  // 🔹 ลบสินค้า (เฉพาะเจ้าของฟาร์ม)
  static async deleteProduct(NID, PID) {
    const product = await Product.findByPk(PID);
    if (!product) throw new Error("Product not found");

    const farm = await Farm.findByPk(product.FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("Permission denied: You don't own this farm");

    await product.destroy();
    return { message: `Product ${PID} deleted successfully` };
  }
}

module.exports = ProductService;
