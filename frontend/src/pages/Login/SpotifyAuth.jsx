import { useEffect } from "react";
import { Link } from "react-router-dom";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=ecc83a6641e049bf952e546ede620995&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private`;
export const SpotifyAuth = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  return (
    <div>
      <h1>This website requires you to login to Spotify</h1>
      <a href={AUTH_URL}>Login to Spotify</a>
      {code && (
        <div>
          <h2>Token Granted</h2> <Link to="/">Go to HomePage</Link>
        </div>
      )}
    </div>
  );
};
