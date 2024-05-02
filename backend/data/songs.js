//data functions to add songs to existing playlist, delete playlist songs, get all playlist songs
import { playlists } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import axios from "axios";
import redis from "redis";

//gets a playlist from the playlist collection and also
const getAllPlaylistSongs = async (playlistId) => {
  //check if Playlist exists
  const client = redis.createClient();
  client.connect();
  const playlistCollection = await playlists();

  const playlistFound = await playlistCollection.findOne({
    _id: new ObjectId(playlistId),
  });

  if (!playlistFound) {
    throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
  }
  console.log("playlist found :");
  console.log(playlistFound);

  let songsIdArray = playlistFound.songIds;
  let songsArray = [];
  //populate songsId with actual songs
  for (let songId of songsIdArray) {
    //check redis if SongID is cached
    let foundSong = await client.get("songId".concat(songId));
    let songData;

    if (foundSong) {
      console.log("songId", songId, "found in cache, returning it");
      songData = JSON.parse(foundSong);
      songsArray.push(songData);
    } else {
      console.log("songId", songId, "NOT found in cache, setting it");
      // Get the song data from the Deezer API
      const response = await axios.get(
        `https://api.deezer.com/track/${songId}`
      );
      let songData = response.data;

      // Set the Redis cache
      await client.set("songId".concat(songId), JSON.stringify(songData));
      console.log("SongId", songId, "is set in cache");
    }
    songsArray.push(songData);
  }

  playlistFound.songsArray = songsArray;
  console.log("playlistFound = ", playlistFound);
  return playlistFound;
};

const addSongToPlaylist = async (songId, playlistId) => {
  const client = redis.createClient();
  client.connect();
  //check if Playlist exists
  const playlistCollection = await playlists();

  const playlistFound = await playlistCollection.findOne({
    _id: new ObjectId(playlistId),
  });

  if (!playlistFound) {
    throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
  }
  console.log("Playlist found");
  //check redis if SongID is cached
  let foundSong = await client.get("songId".concat(songId));
  let songData;

  if (foundSong) {
    console.log("songId", songId, "found in cache, returning it");
    songData = JSON.parse(foundSong);
  } else {
    // Get the song data from the Deezer API
    const response = await axios.get(`https://api.deezer.com/track/${songId}`);
    let songData = response.data;

    // Set the Redis cache
    await client.set("songId".concat(songId), JSON.stringify(songData));
    console.log("SongId", songId, "is set in cache");
  }
  //check if song already exists in playlist
  if (playlistFound.songIds.includes(songId)) {
    throw {
      code: 400,
      error: `Song with ID ${songId} already exists in the playlist`,
    };
  }

  //insert into playlist's songIds
  const updatedPlaylist = await playlistCollection.updateOne(
    { _id: new ObjectId(playlistId) },
    { $push: { songIds: songId } }
  );

  if (updatedPlaylist.modifiedCount === 0) {
    throw { code: 500, error: "Failed to add song to playlist" };
  }
  console.log(
    "Song",
    songId,
    "successfully inserted into ",
    "playlist ",
    playlistId
  );
  return updatedPlaylist;
};

const DeleteSongsInPlaylist = async (songIds, playlistId) => {
  //check if Playlist exists
  const playlistCollection = await playlists();

  const playlistFound = await playlistCollection.findOne({
    _id: new ObjectId(playlistId),
  });

  if (!playlistFound) {
    throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
  }
  console.log("Playlist found");

  for (const songId of songIds) {
    // Check if song exists in playlist
    if (!playlistFound.songIds.includes(songId)) {
      throw {
        code: 400,
        error: `Song with ID ${songId} not found in the playlist`,
      };
    }

    // Delete song from playlist's songIds
    const updatedPlaylist = await playlistCollection.updateOne(
      { _id: new ObjectId(playlistId) },
      { $pull: { songIds: songId } }
    );

    if (updatedPlaylist.modifiedCount === 0) {
      throw {
        code: 500,
        error: `Failed to delete song with ID ${songId} from playlist ${playlistId}`,
      };
    }

    console.log(`Song with ID ${songId} deleted from playlist`);
  }
};
//tester
// try {
//   await addSongToPlaylist("3135554", "6632cad7465962dac74ff5ca");
//   await DeleteSongsInPlaylist(
//     ["3135556", "3135554"],
//     "6632cad7465962dac74ff5ca"
//   );
//   await getAllPlaylistSongs("6632cad7465962dac74ff5ca");
//   await addSongToPlaylist("3135554", "6632cad7465962dac74ff5ca");
// } catch (e) {
//   console.log(e);
// }