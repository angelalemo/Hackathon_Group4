const axios = require("axios");

async function sendLineMessage(channelToken, userId, message) {
  if (!channelToken || !userId) {
    console.warn("❌ Missing LINE channelToken or userId");
    return;
  }

  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: userId,
        messages: [{ type: "text", text: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${channelToken}`,
        },
      }
    );

    console.log("✅ LINE message sent to:", userId);
  } catch (error) {
    console.error("❌ LINE message failed:", error.response?.data || error.message);
  }
}

module.exports = { sendLineMessage };