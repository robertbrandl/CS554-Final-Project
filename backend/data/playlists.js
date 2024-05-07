import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import { playlists, users } from "../config/mongoCollections.js";
import {
  indexArray,
  printAllData,
  synchronizeData,
} from "../config/elasticSync.js";
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
    if (allPlaylists.length > 0) {
      await synchronizeData();
      //await printAllData();
    }
  } catch (e) {
    throw e.message || e;
  }
  return allPlaylists;
};
const getFollowingPlaylists = async (userEmail) => {
  let em = validation.checkString(userEmail);
  const userCollection = await users();
  const user = await userCollection.findOne({ emailAddress: em });
  if (user === null) throw "No user account with that email";
  let allPlaylists = [];
  console.log(user);

  try {
    if (user.followedUsers && user.followedUsers.length > 0) {
      //get users that are followed by user
      user.followedUsers = user.followedUsers.map((e) => new ObjectId(e));
      const followedUsers = await userCollection.find({
        _id: { $in: user.followedUsers },
      }).toArray();
      console.log(followedUsers)
      if (followedUsers && followedUsers.length > 0) {
        //get playlists of those followed ids
        const playlistCollection = await playlists();
        const followedPlaylists = await playlistCollection.find({
          userId: { $in: followedUsers.map((user) => user._id) },
        });
        allPlaylists = await followedPlaylists.toArray();

        await indexArray(allPlaylists);
      }
    }
  } catch (e) {
    throw e.message || e;
  }
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
const getSavedPlaylists = async (playlistIds) => {
  let ret = [];
  const playlistCollection = await playlists();
  for (let x of playlistIds) {
    console.log(x);
    const playlist = await playlistCollection.findOne({ _id: new ObjectId(x) });
    if (!playlist) {
      throw { code: 404, message: "Playlist not found" };
    }
    console.log(playlist);
    ret.push(playlist);
  }
  return ret;
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
    try {
        validation.stringValidation(newPlaylist.title);
        newPlaylist.userId = new ObjectId(newPlaylist.userId);
        await validation.checkId(userId, "userId");
    }
    catch(e){throw {code: 400, error: e}}
    
    
    //check if userId exists in users collection
    const userFound = await userCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!userFound) {
      throw { code: 404, error: `User with ID ${userId} not found` };
    }
    try{
        validation.stringValidation(newPlaylist.userName);
    }catch(e){
        throw {code: 400, error: e}
    }
    try{
        validation.checkString(newPlaylist.genre);
    }catch(e){
        throw {code: 400, error: "Error: must provide a genre or select No Genre!"}
    }
    if (!albumCover){
        throw {code: 400, error: "Error: must provide a cover picture for the playlist"}
    }
    

    createNewPlaylist = await playlistCollection.insertOne(newPlaylist);
    // Push the created playlistId into the user's playlists array
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { playlists: createNewPlaylist.insertedId } }
    );
  } catch (e) {
    console.log(e);
    throw e;
  }

  console.log(newPlaylist.title, "Inserted into DB");
  return createNewPlaylist;
};

const updatePlaylist = async (playlistId, updates, userId) => {
  console.log("in create playlist DF");
  const playlistCollection = await playlists();

  const playlistFound = await playlistCollection.findOne({
    _id: new ObjectId(playlistId),
  });

  if (!playlistFound) {
    throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
  }
  console.log("playlist found");

  if (String(playlistFound.userId) !== userId) {
    throw { code: 403, error: `Unauthorized to edit this playlist` };
  }
  console.log("User Authorized to edit this playlist");

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
  console.log("playlist after updates =", playlistFound);

  const updatedPlaylist = await playlistCollection.updateOne(
    { _id: new ObjectId(playlistId) },
    { $set: playlistFound }
  );

  if (updatedPlaylist.modifiedCount === 0) {
    throw { code: 500, error: "Failed to update playlist" };
  }

  console.log("playlist updated");
  return updatedPlaylist;
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
    await userCollection.updateMany(
      { savedPlaylists: { $in: [playlistId] } },
      { $pull: { savedPlaylists: playlistId } }
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
  getFollowingPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getUsersPlaylists,
  getSavedPlaylists,
};
