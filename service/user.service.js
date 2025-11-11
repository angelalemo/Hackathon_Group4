const e = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");

class UserService {
  static async registerUser(data) {
    const { username, password, type, line, facebook, email, phoneNumber } = data;

    if (!type){
        usertype = "Customer";
    }else{
        usertype = "Farmer";
    }

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

  static async deleteUser(NID) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");

    await user.destroy();
    return { message: `User with NID ${NID} deleted successfully` };
  }
}


module.exports = UserService;

