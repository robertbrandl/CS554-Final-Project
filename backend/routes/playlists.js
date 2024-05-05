import { Router } from "express";
const router = Router();
import { playlistData, songsData } from "../data/index.js";

import { userData } from "../data/index.js";
import { searchData, searchFollowed } from "../config/elasticSync.js";
import { createClient } from "redis";
import xss from 'xss';
const client = createClient();
client.connect().then(() => {});
//route to get a single song route based on its id

router.route("/playlist/:id").get(async (req, res) => {
  try {
    let playlistRef = await playlistData.getPlaylist(xss(req.params.id));
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
      const data = await playlistData.getAllPlaylists();
      await client.SETEX(`allplaylists`, 3600, JSON.stringify(data));
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
});
router.route("/followedplaylists").get(async (req, res) => {
  const { email } = xss(req.query);
  let exists = await client.exists(`followedplaylists/${email}`);
  if (exists) {
    let result = await client.get(`followedplaylists/${email}`);
    return res.status(200).json(JSON.parse(result));
  } else {
    try {
      const data = await playlistData.getFollowingPlaylists(email);
      await client.SETEX(
        `followedplaylists/${email}`,
        3600,
        JSON.stringify(data)
      );
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
});
router.route("/searchbyname").get(async (req, res) => {
  try {
    const data = await searchFollowed(xss(req.query.name));
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
router.route("/searchfollowedbyname").get(async (req, res) => {
  try {
    const data = await searchData(xss(req.query.name));
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

router.route("/createplaylist").post(async (req, res) => {
  try {
    console.log("req.body =", req.body);
    const { title, userName, genre, email } = req.body;

    const albumCover = xss(req.file);
    console.log("Uploaded image:", albumCover);

    //data validation

    let userRef = await userData.getAccount(xss(email));
    let CreatedPlaylist = await playlistData.createPlaylist(
      xss(title),
      userRef._id,
      xss(userName),
      albumCover,
      xss(genre)
    );

    if (CreatedPlaylist && CreatedPlaylist.insertedCount === 1) {
      return res.status(200).json({ message: "Playlist created" });
    }
    await client.del("allplaylists");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
router.route("/getsavedplaylists").get(async (req, res) => {
    try {
      const ids = req.query.playlistIds;
      for (let x of ids){
        x = xss(x);
      }
        const result = await playlistData.getSavedPlaylists(ids);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(e.code || 400).json({ error: "Error: " + e.message});
      }
  });
export default router;
