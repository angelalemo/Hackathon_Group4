const UserService = require("../service/user.service");

class UserController {
    static async registerUser(req, res) {
        try {
            const user = await UserService.registerUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const user = await UserService.loginUser(username, password);
            res.status(200).json(user);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const NID = req.params.NID;
            const user = await UserService.updateUser(NID, req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const NID = req.params.NID;
            const result = await UserService.deleteUser(NID);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;