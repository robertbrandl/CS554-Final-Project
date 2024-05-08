import { Router } from "express";
const router = Router();
import { playlistData, songsData } from "../data/index.js";
import { userData } from "../data/index.js";
import { printAllData, searchData, searchFollowed } from "../config/elasticSync.js";
import { createClient } from "redis";
import xss from "xss";
const client = createClient();
client.connect().then(() => {});
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
// console.log(
//   process.env.CLOUD_NAME +
//     " " +
//     process.env.API_KEY +
//     " " +
//     process.env.API_SECRET
// );

let upload = multer({ dest: "uploads/" });

//route to get a single song route based on its id
router.route("/playlist/:id").get(async (req, res) => {
  try {
    const email = xss(req.query.email);
    let playlistRef = await playlistData.getPlaylist(xss(req.params.id));
    console.log(playlistRef)
    let user = await userData.getUserById(playlistRef.userId.toString());
    console.log(user)
    if (!user.publicPlaylist && user.emailAddress !== email){
        console.log("here")
        return res.status(403).json({error: "You do not have permission to view this page. This playlist is private"})
    }
    let songsRef = await songsData.getAllPlaylistSongs(xss(req.params.id));
    let data = { playlist: playlistRef, songs: songsRef };

    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.code).json({ error: e.error });
  }
});

router.route("/allplaylists").get(async (req, res) => {
  let exists = await client.exists(`allplaylists`); //this helps with the elasticsearch bc less syncing needed!
  if (exists) {
    let result = await client.get(`allplaylists`);
    return res.status(200).json(JSON.parse(result));
  } else {
    try {
      let data = await playlistData.getAllPlaylists();
      for (let x of data){
        console.log(x);
        let id = x.userId;
        console.log(id)
        let user = await userData.getUserById(id.toString());
        console.log("user=" + Object.keys(user));
        console.log(user.publicPlaylist)
        if (!user.publicPlaylist){
            console.log("innerid=" + id)
            data = data.filter(e => e._id !== x._id);
            console.log("hi")
        }
      }
      console.log(data);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
});
router.route("/followedplaylists").get(async (req, res) => {
  const email = xss(req.query.email);
    try {
      const data = await playlistData.getFollowingPlaylists(email);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
});
router.route("/searchbyname").get(async (req, res) => {
  try {
    if (req.query.name.trim().length > 50){
        return res.status(400).json({ error: "Search value must be less than or equal to 50 characters!" });
    }
    let data = await searchData(xss(req.query.name), xss(req.query.genre));
    console.log(data);
    for (let x of data){
        console.log(x._source.doc);
        let id = x._source.doc.userId;
        console.log(id)
        let user = await userData.getUserById(id.toString());
        console.log("user=" + Object.keys(user));
        console.log(user.publicPlaylist)
        if (!user.publicPlaylist){
            console.log("innerid=" + id)
            data = data.filter(e => e._id !== x._id);
            console.log("hi")
        }
      }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
router.route("/searchfollowedbyname").get(async (req, res) => {
  try {
    if (req.query.name.trim().length > 50){
        return res.status(400).json({ error: "Search value must be less than or equal to 50 characters!" });
    }
    const data = await searchFollowed(xss(req.query.name), xss(req.query.genre));
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/myplaylists").get(async (req, res) => {
  try {
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/myplaylists").delete(async (req, res) => {
  try {
    const { playlistId, userEmail } = req.body;
    console.log("req.body=", req.body);
    let userRef = await userData.getAccount(xss(userEmail));
    let deletedPlaylist = await playlistData.deletePlaylist(
      playlistId,
      userRef._id
    );
    if (deletedPlaylist && deletedPlaylist.acknowledged) {
      await client.del("allplaylists");
      return res.status(200).json({ message: "Playlist deleted successfully" });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/myplaylists").put(async (req, res) => {
  try {
    const { email } = req.body;
    let userRef = await userData.getAccount(xss(email));

    let usersPlaylists = await playlistData.getUsersPlaylists(userRef._id);
    console.log(usersPlaylists);
    return res.status(200).json({
      message: "Playlist updated successfully",
      playlists: usersPlaylists,
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/myplaylists/deletesong").delete(async (req, res) => {
  try {
    const { songId, playlistId, userEmail } = req.body;
    console.log("req.body=", req.body);
    let userRef = await userData.getAccount(xss(userEmail));
    let deletedPlaylist = await songsData.DeleteSongInPlaylist(
      songId,
      playlistId,
      userRef._id
    );

    return res.status(200).json({ message: "Song deleted successfully" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/myplaylists").put(async (req, res) => {
  try {
    const { email } = req.body;
    let userRef = await userData.getAccount(xss(email));

    let usersPlaylists = await playlistData.getUsersPlaylists(userRef._id);
    console.log(usersPlaylists);
    return res.status(200).json({
      message: "Playlist updated successfully",
      playlists: usersPlaylists,
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router
  .route("/createplaylist")
  .post(upload.single("albumCover"), async (req, res) => {
    try {
      const { title, genre, email } = req.body;
      let albumCover = null;
      if (req.file && req.file.path) {
        albumCover = req.file.path;
        let cloudinaryImage = await cloudinary.uploader.upload(albumCover);
        albumCover = cloudinaryImage.secure_url;
      }
      //data validation
      let userRef = await userData.getAccount(xss(email));
      let CreatedPlaylist = await playlistData.createPlaylist(
        xss(title),
        userRef._id,
        albumCover,
        xss(genre)
      );
      if (CreatedPlaylist && CreatedPlaylist.acknowledged) {
        await client.del("allplaylists");
        return res.status(200).json({ message: "Playlist created" });
      }
    } catch (e) {
        console.log(e);
      return res.status(e.code).json({ error: e.error });
    }
  });
router.route("/getsavedplaylists").get(async (req, res) => {
  try {
    const ids = req.query.playlistIds;
    for (let x of ids) {
      x = xss(x);
    }
    const result = await playlistData.getSavedPlaylists(ids);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.code || 400).json({ error: "Error: " + e.message });
  }
});

router
  .route("/editplaylist/:id")
  .patch(upload.single("albumCover"), async (req, res) => {
    try {
      const playlistId = req.params.id;
      console.log("req.body =", req.body);
      const { title, userName, genre, email } = req.body;

      let albumCover = null;
      if (req.file && req.file.path) {
        albumCover = req.file.path;
        let cloudinaryImage = await cloudinary.uploader.upload(albumCover);
        albumCover = cloudinaryImage.secure_url;
      }
      else{
        albumCover = req.body.albumCover
      }
      console.log(albumCover)
      //data validation

      let userRef = await userData.getAccount(xss(email));
      console.log("playlistId =", playlistId);

      let sanatizedTitle = xss(title);
      let sanatizedUserName = xss(userName);
      let sanatizedGenre = xss(genre);

      const updatedPlaylist = await playlistData.updatePlaylist(
        playlistId,
        {
          title: sanatizedTitle,
          userName: sanatizedUserName,
          albumCover,
          genre: sanatizedGenre,
        },
        userRef._id
      );
      console.log(updatedPlaylist);

      if (updatedPlaylist) {
        await client.del("allplaylists");
        return res.status(200).json({ message: "Playlist updated" });
      } else {
        return res.status(500).json({ error: "Failed to update playlist" });
      }
    } catch (e) {
      return res.status(e.code).json({ error: e.error });
    }
  });

export default router;
