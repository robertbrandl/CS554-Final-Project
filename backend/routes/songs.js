import { Router } from "express";
const router = Router();
import axios from "axios";
import redis from "redis";
const client = redis.createClient();
import gm from "gm";
import fs from "fs";
import request from "request"
client.connect();
//route to get a single song route based on its id
router.route("/song/:id").get(async (req, res) => {

  //check redis if SongID is cached
  let foundSong = await client.get("songId".concat(req.params.id));
  let songData;

  
  if (foundSong) {
    console.log("songId",req.params.id, "found in cache, returning it");
    songData = JSON.parse(foundSong);

  } else {
    // Get the song data from the Deezer API
    const response = await axios.get(`https://api.deezer.com/track/${req.params.id}`);
    songData = response.data
    console.log(songData)
    // resize the album cover picture and artist picture for display!
    if (songData.album && songData.album.cover_medium) {
      const resizedImageBuffer = await resizeImage(songData.album.cover_medium, 150, 150);
      const resizedImageBase64 = resizedImageBuffer.toString("base64");
      songData.album.cover_medium = `data:image/jpeg;base64,${resizedImageBase64}`;
    }
    if (songData.artist && songData.artist.picture_medium) {
      const resizedImageBuffer = await resizeImage(songData.artist.picture_medium, 120, 120);
      const resizedImageBase64 = resizedImageBuffer.toString("base64");
      songData.artist.picture_medium = `data:image/jpeg;base64,${resizedImageBase64}`;
    }

    // Set the Redis cache
    await client.set("songId".concat(req.params.id), JSON.stringify(songData));
    console.log("SongId",req.params.id, "is set in cache");
  }
  
    console.log(songData)
    return res.status(200).json(songData);
});
const resizeImage = async (imageUrl, width, height) => {
  try {
    console.log(imageUrl)
    const response = request(imageUrl, { encoding: null });

    return new Promise((resolve, reject) => {
      gm(response)
        .resize(width, height)
        .toBuffer((err, buffer) => {
          if (err) {
            console.error('GraphicsMagick Error:', err);
            reject(err);
          } else {
            resolve(buffer);
          }
        });
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};
router.route("/search/:query").get(async (req, res) => {

  let foundSongs = await client.get("search-".concat(req.params.query));
  let songData;

  if (foundSongs) {
    console.log("songs",req.params.query, "found in cache, returning it");
    songData = JSON.parse(foundSongs);

  } else {
    const response = await axios.get(`https://api.deezer.com/search?q=${req.params.query}`);
    songData = response.data

    await client.set("search-".concat(req.params.query), JSON.stringify(songData));
    console.log("Songs",req.params.query, "is set in cache");
  }

    console.log(songData)
    return res.status(200).json(songData);
});

export default router;
