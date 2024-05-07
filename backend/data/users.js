import {ObjectId} from 'mongodb';
import * as validation from '../validation.js';
import {users, playlists } from '../config/mongoCollections.js';
import axios from "axios";
const registerUser = async (
    name,
    emailAddress,
    publicPlaylist,
    type
) => {
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: emailAddress});
    if (user !== null) throw 'User exists already';

    let newUser = {
        name: name,
        emailAddress: emailAddress,
        publicPlaylist: publicPlaylist,//true if playlists/user is public (can be followed and playlists in main list)
        accountType: type,
        playlists: [],
        followedUsers: [],
        savedPlaylists: []
    }
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';
    return insertInfo;
}

const getAccount = async (email) => {
    let em = undefined;
    try{
        em = validation.checkString(email);
    }catch(e){
        throw { code: 400, error: e};
    }
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: em});
    if (user === null) throw { code: 404, error:'No user account with that id'};
    user._id = user._id.toString();
    return user;
}
const getUserById = async (userId) => {
    let id = undefined;
    try {
        id = validation.checkString(userId);
    } catch (e) {
        throw { code: 400, error: e };
    }
    if (!ObjectId.isValid(id)) {
        throw { code: 400, error: "Invalid user ID format" };
    }
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (user === null) throw { code: 404, error:'No user account with that id'};
    user._id = user._id.toString();
    return user;
}
const followUser = async (email, userToFollowId) => {
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: em});
    if (user === null)  throw { code: 404, error: 'User not found' };
    const updateResult = await userCollection.updateOne(
        { emailAddress: email },
        { $addToSet: { followedUsers: userToFollowId } } 
    );
    if (updateResult.modifiedCount !== 1) {
        throw { code: 500, error: 'Failed to follow user' };
    }
    return updateResult;
};
const unfollowUser = async (email, userToUnfollowId) => {
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: em});
    if (user === null)  throw { code: 404, error: 'User not found' };
    const updateResult = await userCollection.updateOne(
        { emailAddress: email },
        { $pull: { followedUsers: userToUnfollowId } }
    );
    if (updateResult.modifiedCount !== 1) {
        throw { code: 500, error: 'Failed to unfollow user' };
    }
    return updateResult;
};
const savePlaylist = async (email, playlistId) => {
    const userCollection = await users();
    
    const user = await userCollection.findOne({emailAddress: email});
    if (user === null)  throw { code: 404, error: 'User not found' };
    const updateResult = await userCollection.updateOne(
        { emailAddress: email },
        { $addToSet: { savedPlaylists: playlistId } } 
    );
    if (updateResult.modifiedCount !== 1) {
        throw { code: 500, error: 'Failed to save playlist' };
    }
    return updateResult;
};
const unsavePlaylist = async (email, playlistId) => {
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: email});
    if (user === null)  throw { code: 404, error: 'User not found' };
    const updateResult = await userCollection.updateOne(
        { emailAddress: email },
        { $pull: { savedPlaylists: playlistId } }
    );
    if (updateResult.modifiedCount !== 1) {
        throw { code: 500, error: 'Failed to unsave playlist' };
    }
    return updateResult;
};
const userExist = async (email) => {
    let em = validation.checkString(email);
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: em});
    if (user === null) return false;
    return true;
}
const setUserPublic = async (email) => {
    try {
        const userCollection = await users();
        const updateResult = await userCollection.updateOne(
            { emailAddress: email },
            { $set: { publicPlaylist: true } }
        );
        if (updateResult.modifiedCount !== 1) {
            throw { code: 500, error: 'Failed to set user as public' };
        }
        return updateResult;
    } catch (error) {
        console.error('Error setting user as public:', error);
        throw { code: 500, error: 'Error setting user as public' };
    }
}
const setUserPrivate = async (email) => {
    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ emailAddress: email });
        if (!user) {
            throw { code: 404, message: 'User not found' };
        }
        const updateResult = await userCollection.updateOne(
            { emailAddress: email },
            { $set: { publicPlaylist: false } }
        );
        if (updateResult.modifiedCount !== 1) {
            throw { code: 500, error: 'Failed to set user as public' };
        }
        const res = await userCollection.updateMany(
            { followedUsers: { $in: [user._id.toString()] } },
            { $pull: { followedUsers: user._id.toString() } }
        );
        return updateResult;
    } catch (error) {
        console.error('Error setting user as public:', error);
        throw { code: 500, error: 'Error setting user as public' };
    }
}
const getFollowedUsers = async (followedIds) =>{
    let ret = [];
    const userCollection = await users();
    for (let x of followedIds){
        const user = await userCollection.findOne({ _id: new ObjectId(x) });
        if (!user) {
            throw { code: 404, message: 'User not found' };
        }
        ret.push(user);
    }
    return ret;
}
const getUserStats = async (email) => {
    const userCollection = await users();
    const user = await userCollection.findOne({ emailAddress: email });
  
    if (!user) {
      throw { code: 404, error: 'User not found' };
    }
    const followedUsers = user.followedUsers.length;
    const followers = await countFollowers(user._id.toString(), userCollection);
    const playlistsCreated = user.playlists.length;
    const songsPerArtist = await calculateSongsPerArtist(user.playlists); 
    return {
      followedUsers,
      followers,
      playlistsCreated,
      songsPerArtist
    };
}

const countFollowers = async (userId, userCollection) => {
    const users = await userCollection.find({ followedUsers: userId }).toArray();
    return users.length;
}

const calculateSongsPerArtist = async (playlistsarr) => {
    const songsPerArtist = {};
    for (const playlist of playlistsarr) {
        const playlistCollection = await playlists();
        const playlistFound = await playlistCollection.findOne({
            _id: playlist,
        });
        if (playlistFound && playlistFound.songIds && playlistFound.songIds.length > 0){
            for (const song of playlistFound.songIds) {
                const response = await axios.get(
                    `https://api.deezer.com/track/${song}`
                  );
                let songData = response.data;
                if (!songsPerArtist[songData.artist.name]) {
                    songsPerArtist[songData.artist.name] = 1;
                } else {
                    songsPerArtist[songData.artist.name]++;
                }
            }
        }
    }
    return songsPerArtist;
}
  export default {
    registerUser,
    getAccount, 
    userExist,
    followUser,
    unfollowUser,
    getUserById,
    setUserPublic,
    setUserPrivate,
    getFollowedUsers,
    savePlaylist,
    unsavePlaylist,
    getUserStats 
  }