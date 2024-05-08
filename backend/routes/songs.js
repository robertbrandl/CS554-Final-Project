import { Router } from "express";
const router = Router();
import axios from "axios";
import redis from "redis";
const client = redis.createClient();
import gm from "gm";
import xss from "xss";
import request from "request";
import { playlistData, songsData } from "../data/index.js";
client.connect();
//route to get a single song route based on its id
router.route("/song/:id").get(async (req, res) => {
  //check redis if SongID is cached
  let foundSong = await client.get("songId".concat(xss(req.params.id)));
  let songData;

  if (foundSong) {
    console.log("songId", xss(req.params.id), "found in cache, returning it");
    songData = JSON.parse(foundSong);
  } else {
    // Get the song data from the Deezer API
    const response = await axios.get(
      `https://api.deezer.com/track/${xss(req.params.id)}`
    );
    songData = response.data;
    console.log(songData);
    // resize the album cover picture and artist picture for display!
    if (songData.album && songData.album.cover_medium) {
      const resizedImageBuffer = await resizeImage(
        songData.album.cover_medium,
        200,
        200
      );
      const resizedImageBase64 = resizedImageBuffer.toString("base64");
      songData.album.cover_medium = `data:image/jpeg;base64,${resizedImageBase64}`;
    }
    if (songData.artist && songData.artist.picture_medium) {
      const resizedImageBuffer = await resizeImage(
        songData.artist.picture_medium,
        120,
        120
      );
      const resizedImageBase64 = resizedImageBuffer.toString("base64");
      songData.artist.picture_medium = `data:image/jpeg;base64,${resizedImageBase64}`;
    }

    // Set the Redis cache
    await client.set(
      "songId".concat(xss(req.params.id)),
      JSON.stringify(songData)
    );
    console.log("SongId", xss(req.params.id), "is set in cache");
  }

  console.log(songData);
  return res.status(200).json(songData);
});

//route to get a single artists songs based on its id
router.route("/artistsongs").get(async (req, res) => {
  //check redis if SongID is cached
  let { artistId } = req.query;
  let foundArtistSongs = await client.get(
    "artistSongsId".concat(xss(artistId))
  );
  let artistSongsData;

  if (foundArtistSongs) {
    console.log("artistSongsId", xss(artistId), "found in cache, returning it");
    artistSongsData = JSON.parse(foundArtistSongs);
  } else {
    // Get the artists songs data from the Deezer API
    const response = await axios.get(
      `https://api.deezer.com/artist/${xss(String(artistId))}/top?limit=50`
    );

    artistSongsData = response.data;
    console.log("artistSongsData =", artistSongsData);

    // Set the Redis cache
    await client.set(
      "artistSongsId".concat(xss(artistId)),
      JSON.stringify(artistSongsData)
    );
    console.log("artistSongsId", xss(artistId), "is set in cache");
  }

  console.log(artistSongsData);
  return res.status(200).json(artistSongsData);
});

const resizeImage = async (imageUrl, width, height) => {
  try {
    console.log(imageUrl);
    const response = request(imageUrl, { encoding: null });

    return new Promise((resolve, reject) => {
      gm(response)
        .resize(width, height)
        .toBuffer((err, buffer) => {
          if (err) {
            console.error("GraphicsMagick Error:", err);
            reject(err);
          } else {
            resolve(buffer);
          }
        });
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};
router.route("/search/:query").get(async (req, res) => {
  try {
    let foundSongs = await client.get("search-".concat(xss(req.params.query)));
    let songData;

    if (foundSongs) {
      console.log(
        "songs",
        xss(req.params.query),
        "found in cache, returning it"
      );
      songData = JSON.parse(foundSongs);
    } else {
      const response = await axios.get(
        `https://api.deezer.com/search?q=${req.params.query}`
      );
      songData = response.data;

      await client.set(
        "search-".concat(xss(req.params.query)),
        JSON.stringify(songData)
      );
      console.log("Songs", xss(req.params.query), "is set in cache");
    }

    console.log(songData);
    return res.status(200).json(songData);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/addsong").post(async (req, res) => {
  try {
    console.log(req.body);
    const { songId, playlistId } = req.body;
    //data validation
    let addedToPlaylist = await songsData.addSongToPlaylist(
      xss(songId),
      xss(playlistId)
    );

    if (
      addedToPlaylist &&
      addedToPlaylist.message === "Song added to playlist successfully"
    ) {
      console.log("hit 200");
      return res.status(200).json({ message: "Song added to playlist" });
    }
  } catch (e) {}
});

export default router;
