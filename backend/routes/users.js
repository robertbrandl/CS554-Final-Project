import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import SpotifyWebApi from "spotify-web-api-node";

router.route("/register").post(async (req, res) => {
  const createUserData = req.body;
  if (!createUserData || Object.keys(createUserData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must enter data for the fields" });
  }
  let name = createUserData.displayName;
  let email = createUserData.email;
  let image = createUserData.image;
  console.log(image);
  let publicPlaylist = createUserData.public;
  let type = createUserData.accountType;
  let result = undefined;
  try {
    result = await userData.registerUser(
      name,
      email,
      image,
      publicPlaylist,
      type
    );
  } catch (e) {
    return res.status(400).json({ error: "Error: " + e });
  }
  return res.status(200).json(result);
});
router.route("/account").get(async (req, res) => {
  const email = req.query.email;
  let result = undefined;
  try {
    result = await userData.getAccount(email);
  } catch (e) {
    return res.status(400).json({ error: "Error: " + e });
  }
  return res.status(200).json(result);
});
router.route("/userexist").get(async (req, res) => {
  const email = req.query.email;
  const result = await userData.userExist(email);
  return res.status(200).json(result);
});

router.route("/spotifyAuth").post(async (req, res) => {
  try {
    const code = req.body.code;
    console.log(process.env.CLIENT_ID);
    console.log(process.env.CLIENT_SECRET);
    const SpotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:5173",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    await SpotifyApi.authorizationCodeGrant(code).then((data) => {
      return res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    });
  } catch (error) {
    return res.sendStatus(400);
  }
});

router.route("/refresh").post(async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const SpotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:5173",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken,
    });

    SpotifyApi.refreshAccessToken()
      .then((data) => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        });
        console.log(data.body);
        console.log("Access token is refreshed");

        SpotifyApi.setAccessToken(data.body["access_token"]);
      })
      .catch(() => {
        return res.sendStatus(400);
      });
  } catch (error) {
    return res.sendStatus(400);
  }
});

export default router;
