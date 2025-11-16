export default function LineLogin() {
  const handleLogin = () => {
    const clientId = "2008489287"; // ของนดล
    const redirectUri = "https://localhost:4000/line/callback";

    window.location.href =
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=profile%20openid` +
      `&state=xyz123`;
  };

  return (
    <button onClick={handleLogin}>
      Login with LINE
    </button>
  );
}