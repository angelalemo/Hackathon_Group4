const axios = require("axios");

class LineService {
  static async getAccessToken(code) {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.LINE_REDIRECT_URI,
      client_id: process.env.LINE_CHANNEL_ID,
      client_secret: process.env.LINE_CHANNEL_SECRET,
    });

    const tokenRes = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      body,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return tokenRes.data.access_token;
  }

  static async getUserProfile(accessToken) {
    const profileRes = await axios.get("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return profileRes.data; // { userId, displayName, pictureUrl }
  }
}

module.exports = LineService;