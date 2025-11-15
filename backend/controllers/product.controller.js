const ProductService = require("../service/product.service");

class ProductController {

  static async getAll(req, res) {
    try {
      const products = await ProductService.getAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async getAllByFarm(req, res) {
    try {
      const { FID } = req.params;
      const products = await ProductService.getAllByFarm(FID);
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { PID } = req.params;
      const product = await ProductService.getById(PID);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { NID } = req.body; // ผู้ใช้ที่กำลังทำรายการ
      const newProduct = await ProductService.createProduct(NID, req.body);
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { NID, PID } = req.body;
      const updatedProduct = await ProductService.updateProduct(NID, PID, req.body);
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { NID, PID } = req.body;
      const result = await ProductService.deleteProduct(NID, PID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProductController;