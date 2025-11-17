const express = require("express");
const { User, Farm } = require("../models");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


class UserService {

  static async getAllUser() {
    const users = await User.findAll();
    return users;
  }

  static async getUserById(NID) {
    const user = await User.findByPk(NID, {
      include: [{ model: Farm }]
    });
    return user;
  }

  static async registerUser(data) {
    console.log("Registering user with data:", data);
    const { username, password, type, line, facebook, email, phoneNumber, profileImage } = data;

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
    const user = await User.findOne({ 
      where: { username },
      include: [{ 
        model: Farm, 
        attributes: ['FID', 'farmName'],
        required: false
      }]
    });
    
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign(
      { id: user.NID, type: user.type }, 
      "your_secret_key", 
      { expiresIn: "7d" }
    );

    console.log("=== LOGIN USER DATA ===");
    console.log("NID:", user.NID);
    console.log("Type:", user.type);
    console.log("Farms:", user.Farms);
    console.log("FID:", user.Farms?.[0]?.FID);

    return {
      token,
      NID: user.NID,
      username: user.username,
      type: user.type,
      phoneNumber: user.phoneNumber,
      email: user.email,
      line: user.line,
      facebook: user.facebook,
      FID: user.Farms?.[0]?.FID || null,
      farmName: user.Farms?.[0]?.farmName || null
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
    const response = await axios.get("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { userId, displayName, pictureUrl } = response.data;
    const usertype = type === true ? "Farmer" : "Customer";

    let user = await User.findOne({ 
      where: { line: userId },
      include: [{ 
        model: Farm,
        attributes: ['FID', 'farmName'],
        required: false 
      }]
    });

    if (!user) {
      user = await User.create({
        username: displayName,
        password: null,
        type: usertype,
        line: userId,
        email: null,
        phoneNumber: null,
      });
    }

    const token = jwt.sign({ id: user.NID }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
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

  static async updateUserProfileImage(NID, profileImage) {
  const user = await User.findByPk(NID);
  if (!user) throw new Error("User not found");

  // เช็กว่าเป็น URL หรือไม่
  const isURL = (str) => /^https?:\/\//i.test(str);

  let finalImage = profileImage;

  // ถ้าไม่ใช่ URL → ถือว่าเป็นไฟล์จากเครื่อง → แปลงเป็น Base64
  if (!isURL(profileImage)) {
    const filePath = path.resolve(profileImage);

    if (!fs.existsSync(filePath)) {
      throw new Error("Local image file not found");
    }

    const fileData = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";

    const base64String = fileData.toString("base64");
    finalImage = `data:${mimeType};base64,${base64String}`;
  }

  user.profileImage = finalImage;
  await user.save();
  return user;
}

 static async deleteUser(NID) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");

    await user.destroy();
    return user;
  }
}

module.exports = UserService;