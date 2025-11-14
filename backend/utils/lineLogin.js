const axios = require("axios");

app.get("/line/callback", async (req, res) => {
  const { code } = req.query;

  // 🔑 ขอ access token จาก LINE
  const tokenRes = await axios.post(
    "https://api.line.me/oauth2/v2.1/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://localhost:4000/line/callback",
      client_id: "2008491392", // Channel ID
      client_secret: "76a9cdd8f827f70b264bee9a216bd9c5", // จาก LINE Developers
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const accessToken = tokenRes.data.access_token;

  // 🔍 ดึงข้อมูลผู้ใช้
  const profileRes = await axios.get("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profile = profileRes.data; // { userId, displayName, pictureUrl }

  // ✅ ตอนนี้คุณได้ lineUserId แล้ว
  res.json({
    lineUserId: profile.userId,
    displayName: profile.displayName,
  });
});