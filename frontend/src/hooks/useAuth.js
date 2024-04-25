import { useEffect, useState } from "react";
import axios from "axios";
export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    console.log(code);
    axios
      .post("http://localhost:3000/users/spotifyAuth", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.setExpiresIn);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      console.log("hi");
      axios
        .post("http://localhost:3000/users/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
          console.log(res.data);
        })
        .catch(() => {
          window.location = "/login";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
