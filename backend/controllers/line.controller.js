const LineService = require("../utils/lineService");

class LineController {
  static async lineCallback(req, res) {
    try {
    const code = req.query.code;

    if (!code) return res.status(400).send("Missing code");

    // 1) แลก code → access_token
    const accessToken = await LineService.getAccessToken(code);

    // 2) เอา access token ไปดึง profile
    const profile = await LineService.getUserProfile(accessToken);

    const userId = profile.userId;

    // 3) redirect กลับ frontend พร้อม lineUserId
    return res.redirect(
      `https://yourfrontend.com/registerfarm?lineUserId=${userId}`
    );

  } catch (err) {
    console.error(err);
    return res.status(500).send("LINE callback error");
  }
    }
}
module.exports = LineController;