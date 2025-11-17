const express = require("express");
const { User, Farm } = require("../models"); // ⚠️ เพิ่ม Farm
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");

class UserService {

  static async getAllUser() {
    const users = await User.findAll();
    return users;
  }

  static async getUserById(NID) {
    const user = await User.findByPk(NID);
    return user;
  }

  static async registerUser(data) {
    console.log("Registering user with data:", data);
    const { username, password, type, line, facebook, email, phoneNumber } = data;

    const usertype = type === true ? "Farmer" : "Customer";

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      type: usertype,
      line,
      facebook,
      email,
      phoneNumber,
    });

    return newUser;
  }

  // ✅ แก้ไขตรงนี้
  static async loginUser(username, password) {
    // ดึงข้อมูล User พร้อม Farm (ถ้ามี)
    const user = await User.findOne({ 
      where: { username },
      include: [{ 
        model: Farm, 
        attributes: ['FID', 'farmName', 'location'],
        required: false // ไม่บังคับต้องมี Farm (เพราะ Customer ไม่มี Farm)
      }]
    });
    
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: user.NID, type: user.type }, 
      "your_secret_key", 
      { expiresIn: "7d" }
    );

    // ✅ Return ข้อมูลแบบ flatten พร้อม FID
    return {
      token,
      NID: user.NID,
      username: user.username,
      type: user.type,
      phoneNumber: user.phoneNumber,
      email: user.email,
      line: user.line,
      facebook: user.facebook,
      // ดึง FID จาก relationship (ถ้าเป็น Farmer จะมี Farm)
      FID: user.Farms?.[0]?.FID || null,
      farmName: user.Farms?.[0]?.farmName || null,
      farmLocation: user.Farms?.[0]?.location || null
    };
  }

  static async updateUser(NID, data) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    return user;
  }

  static async registerOrLoginWithLine(accessToken, type) {
    // ดึงข้อมูลโปรไฟล์จาก LINE API
    const response = await axios.get("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { userId, displayName, pictureUrl } = response.data;

    const usertype = type === true ? "Farmer" : "Customer";

    // ตรวจสอบว่าผู้ใช้อยู่ในระบบหรือยัง
    let user = await User.findOne({ 
      where: { line: userId },
      include: [{ model: Farm, required: false }]
    });

    if (!user) {
      // สมัครใหม่ (register)
      user = await User.create({
        username: displayName,
        password: null,
        type: usertype,
        line: userId,
        email: null,
        phoneNumber: null,
      });
    }

    // สร้าง token สำหรับเข้าสู่ระบบ
    const token = jwt.sign({ id: user.NID }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    // ✅ Return แบบเดียวกับ loginUser
    return {
      token,
      NID: user.NID,
      username: user.username,
      type: user.type,
      line: user.line,
      FID: user.Farms?.[0]?.FID || null,
      farmName: user.Farms?.[0]?.farmName || null
    };
  }
}

module.exports = UserService;