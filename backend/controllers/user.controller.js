const UserService = require("../service/user.service");

class UserController {

    static async getAllUser(req, res) {
        try {
            const users = await UserService.getAllUser();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const NID = req.params.NID;
            const user = await UserService.getUserById(NID);    
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
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

}

module.exports = UserController;