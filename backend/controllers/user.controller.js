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
    
    // ✅ เพิ่ม Debug log
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" });
            }
            const result = await UserService.loginUser(email, password);
            
            // 🔍 Debug: ดูว่า return อะไร
            console.log("=== LOGIN SUCCESS ===");
            console.log("Response:", result);
            console.log("NID:", result.NID);
            console.log("FID:", result.FID);
            
            res.status(200).json(result);
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

    static async updateUserProfileImage(req, res) {
        try {
            const { NID, profileImage } = req.body;
            if (!NID || !profileImage) {
                return res.status(400).json({ error: "NID and profileImage are required" });
            }
            const user = await UserService.updateUserProfileImage(NID, profileImage);
            res.status(200).json({ message: "Profile image updated successfully", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email, newPassword } = req.body;
            if (!email || !newPassword) {
                return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่านใหม่" });
            }
            const result = await UserService.resetPassword(email, newPassword);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = UserController;