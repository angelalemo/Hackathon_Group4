const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");

class UserService {
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

  static async loginUser(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    return user;
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
    let user = await User.findOne({ where: { line: userId } });

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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return { user, token };
  }

}


module.exports = UserService;

