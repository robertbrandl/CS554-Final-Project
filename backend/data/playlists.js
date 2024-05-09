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
  const userCollection = await users();
  for (let x of playlistIds) {
    console.log(x);
    const playlist = await playlistCollection.findOne({ _id: new ObjectId(x) });
    if (!playlist) {
      throw { code: 404, message: "Playlist not found" };
    }
    const user = await userCollection.findOne({ _id: playlist.userId });
    if (!user) {
      throw { code: 404, message: "User not found for playlist" };
    }
    console.log(user)
    console.log(playlist);
    if (user.publicPlaylist){
    ret.push(playlist);}
  }
  return ret;
};
const genres = [
    "Rock",
    "Pop",
    "Hip Hop",
    "R&B",
    "Country",
    "Electronic",
    "Latin",
    "K-POP",
    "Classical",
    "Metal",
    "Alternative",
    "Folk",
    "Rap",
    "Gospel",
  ];
const createPlaylist = async (title, userId, albumCover, genre) => {
  const playlistCollection = await playlists();
  const userCollection = await users();
  //check if userId exists in users collection
  const userFound = await userCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!userFound) {
    throw { code: 404, error: `User with ID ${userId} not found` };
  }
  let createNewPlaylist;
  let newPlaylist = {
    title: title.trim(),
    userId: userId.trim(),
    userName: userFound.name,
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
    if (newPlaylist.title.trim().length < 1 || newPlaylist.title.trim().length > 50){
        throw {code: 400, error: "Playlist title must be between 1 and 50 characters"}
    }
    
    
    console.log(newPlaylist.userName)
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
    console.log(newPlaylist.genre)
    console.log(genres.includes(newPlaylist.genre))
    if (!genres.includes(newPlaylist.genre) && newPlaylist.genre !== "No Genre"){
        throw {code: 400, error: "Error: must select a valid genre from the dropdown"}
    }
    if (!albumCover){
        throw {code: 400, error: "Error: must provide a cover picture for the playlist"}
    }
    const existingPlaylist = await playlistCollection.findOne({
        title: newPlaylist.title,
        userName: newPlaylist.userName,
        genre: newPlaylist.genre
      });
      console.log(existingPlaylist);
      if (existingPlaylist) {
        throw { code: 400, error: "Error: You have a playlist with the same title and genre already!" };
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
  console.log("in edit playlist DF");
  const playlistCollection = await playlists();
  console.log(updates);

  const playlistFound = await playlistCollection.findOne({
    _id: new ObjectId(playlistId),
  });

  if (!playlistFound) {
    throw { code: 404, error: `Playlist with ID ${playlistId} not found` };
  }
  console.log("playlist found");

  if (String(playlistFound.userId) !== userId) {
    throw { code: 403, error: `User is unauthorized to edit this playlist` };
  }
  console.log("User Authorized to edit this playlist");
  if (playlistFound.genre === updates.genre.trim() && playlistFound.albumCover === updates.albumCover.trim() && playlistFound.title === updates.title.trim()){
    throw { code: 400, error: `Error: must change at least one field!` };
  }

  //data validation
  try {
    validation.stringValidation(updates.title);
    }
    catch(e){throw {code: 400, error: e}}
    if (updates.title.trim().length < 1 || updates.title.trim().length > 50){
        throw {code: 400, error: "Playlist title must be between 1 and 50 characters"}
    }
  if (updates.title) {
    playlistFound.title = updates.title.trim();
  }
  try{
    validation.stringValidation(updates.userName);
    }catch(e){
        throw {code: 400, error: e}
    }
    try{
        validation.checkString(updates.genre);
    }catch(e){
        throw {code: 400, error: "Error: must provide a genre or select No Genre!"}
    }
    if (!genres.includes(updates.genre.trim()) && updates.genre.trim() !== "No Genre"){
        throw {code: 400, error: "Error: must select a valid genre from the dropdown"}
    }

  if (updates.userName) {
    playlistFound.userName = updates.userName.trim();
  }
  if (!updates.albumCover){
    throw {code: 400, error: "Error: must provide a cover picture for the playlist"}
    }
  if (updates.albumCover) {
    playlistFound.albumCover = updates.albumCover;
  }

  if (updates.genre) {
    playlistFound.genre = updates.genre.trim();
  }
  console.log("playlist after updates =", playlistFound);
  const existingPlaylist = await playlistCollection.findOne({
    title: updates.title.trim(),
    userName: updates.userName.trim(),
    genre: updates.genre.trim()
  });
  console.log(existingPlaylist);
  if (existingPlaylist) {
    throw { code: 400, error: "Error: You have a playlist with the same title and genre already!" };
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
