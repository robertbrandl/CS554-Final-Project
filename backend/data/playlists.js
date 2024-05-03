import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import { playlists, users } from "../config/mongoCollections.js";
import { synchronizeData } from "../config/elasticSync.js";
const getPlaylist = async (playlistId) => {
  let id = undefined;
  try {
    id = validation.checkString(playlistId);
  } catch (e) {
    throw { code: 400, error: e };
  }
  if (!ObjectId.isValid(playlistId)) {
    throw { code: 400, error: "Invalid playlist ID format" };
  }
  const playlistCollection = await playlists();
  let playlist = undefined;
  try {
    playlist = await playlistCollection.findOne({ _id: new ObjectId(id) });
  } catch (e) {
    throw { code: 500, error: "Internal Server Error" };
  }
  if (!playlist) {
    throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
  }
  return playlist;
};
const getAllPlaylists = async () => {
  const playlistCollection = await playlists();
  let allPlaylists = undefined;
  try {
    allPlaylists = await playlistCollection.find({}).toArray();
  } catch (e) {
    throw e.message || e;
  }
  await synchronizeData();
  return allPlaylists;
};

const getUsersPlaylists = async (userId) => {
  console.log("in getUsersPlaylists DF");
  console.log(userId);
  const playlistCollection = await playlists();
  let userPlaylists = undefined;
  try {
    userPlaylists = await playlistCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();
  } catch (e) {
    throw e.message || e;
  }

  return userPlaylists;
};

const createPlaylist = async (title, userId, userName, albumCover, genre) => {
  const playlistCollection = await playlists();
  const userCollection = await users();

  let createNewPlaylist;
  let newPlaylist = {
    title: title.trim(),
    userId: userId.trim(),
    userName: userName.trim(),
    albumCover: albumCover,
    dateCreated: new Date(),
    genre: genre.trim(),
    songIds: [],
  };

  try {
    //data validation
    validation.stringValidation(newPlaylist.title);
    newPlaylist.userId = new ObjectId(newPlaylist.userId);
    await validation.checkId(userId, "userId");
    //check if userId exists in users collection
    const userFound = await userCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!userFound) {
      throw { code: 404, error: `User with ID ${userId} not found` };
    }
    validation.stringValidation(newPlaylist.userName);
    validation.stringValidation(newPlaylist.genre);

    createNewPlaylist = await playlistCollection.insertOne(newPlaylist);
    // Push the created playlistId into the user's songIds array
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { songIds: createNewPlaylist.insertedId } }
    );
  } catch (e) {
    throw e.message || e;
  }

  console.log(newPlaylist.title, "Inserted into DB");
  return createNewPlaylist;
};

const updatePlaylist = async (playlistId, updates) => {
  const playlistCollection = await playlists();
  try {
    const playlistFound = await playlistCollection.findOne({
      _id: new ObjectId(playlistId),
    });

    if (!playlistFound) {
      throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
    }
    console.log("playlist found");

    //data validation
    if (updates.title) {
      validation.stringValidation(updates.title);
      playlistFound.title = updates.title.trim();
    }

    if (updates.userName) {
      validation.stringValidation(updates.userName);
      playlistFound.userName = updates.userName.trim();
    }
    if (updates.albumCover) {
      playlistFound.albumCover = updates.albumCover;
    }

    if (updates.genre) {
      validation.stringValidation(updates.genre);
      playlistFound.genre = updates.genre;
    }

    const updatedPlaylist = await playlistCollection.updateOne(
      { _id: new ObjectId(playlistId) },
      { $set: playlistFound }
    );

    if (updatedPlaylist.modifiedCount === 0) {
      throw { code: 500, error: "Failed to update playlist" };
    }

    console.log("playlist updated");
    return updatedPlaylist;
  } catch (e) {
    throw e.message || e;
  }
};

const deletePlaylist = async (playlistId, userId) => {
  const playlistCollection = await playlists();
  const userCollection = await users();
  try {
    const playlistFound = await playlistCollection.findOne({
      _id: new ObjectId(playlistId),
    });

    if (!playlistFound) {
      throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
    }
    console.log("playlist found");

    if (String(playlistFound.userId) !== userId) {
      throw { code: 403, error: `Unauthorized to delete this playlist` };
    }
    console.log("User Authorized to delete this playlist");

    const deletedPlaylist = await playlistCollection.deleteOne({
      _id: new ObjectId(playlistId),
    });

    if (deletedPlaylist.deletedCount === 0) {
      throw { code: 500, error: "Failed to delete playlist" };
    }

    console.log("playlist deleted");

    // Pull the created playlistId into the user's songIds array
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { songIds: new ObjectId(playlistFound._id) } }
    );
    return deletedPlaylist;
  } catch (e) {
    throw e.message || e;
  }
};
//tester
try {
  // await createPlaylist(
  //   "TRys",
  //   "662814901e7dca64ab67edf4",
  //   "Rivaldo DSilva",
  //   "linktoAlbumCover",
  //   "POP"
  // );
  // await deletePlaylist("6634266ade6bd088d7978944", "662814901e7dca64ab67edf4");
} catch (e) {
  console.log(e);
}

export default {
  getPlaylist,
  getAllPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getUsersPlaylists,
};
