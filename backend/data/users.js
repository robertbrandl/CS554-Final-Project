import {ObjectId} from 'mongodb';
import * as validation from '../validation.js';
import {users} from '../config/mongoCollections.js';
const registerUser = async (
    name,
    emailAddress,
    profileImg,
    publicPlaylist,
    type
) => {
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: emailAddress});
    if (user !== null) throw 'User exists already';
    console.log(profileImg)

    let newUser = {
        name: name,
        emailAddress: emailAddress,
        profileImg: profileImg,
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
    let em = validation.checkString(email);
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: em});
    if (user === null) throw 'No user account with that email';
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
    const updateResult = await userCollection.updateOne(
        { emailAddress: email },
        { $addToSet: { followedUsers: userToFollowId } } 
    );
    if (updateResult.modifiedCount !== 1) {
        throw 'Failed to follow user';
    }
    return updateResult;
};
const unfollowUser = async (email, userToUnfollowId) => {
    const userCollection = await users();
    const updateResult = await userCollection.updateOne(
        { emailAddress: email },
        { $pull: { followedUsers: userToUnfollowId } }
    );
    if (updateResult.modifiedCount !== 1) {
        throw 'Failed to unfollow user';
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
export default {
    registerUser,
    getAccount, 
    userExist,
    followUser,
    unfollowUser,
    getUserById
}