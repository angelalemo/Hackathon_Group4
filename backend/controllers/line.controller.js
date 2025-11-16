const LineService = require("../utils/lineService");

class LineController {
  static async lineCallback(req, res) {
    try {
      const code = req.query.code;
      if (!code) return res.status(400).send("Missing code");
      const accessToken = await LineService.getAccessToken(code);
      const profile = await LineService.getUserProfile(accessToken);
      const userId = profile.userId;
      const displayName = profile.displayName;
      return res.redirect(
        `http://localhost:3000/CreateFarm?lineUserId=${userId}&lineName=${encodeURIComponent(displayName)}`
      );
    } catch (err) {
      console.error(err);
      return res.status(500).send("LINE callback error");
    }
  }
}

module.exports = LineController;
