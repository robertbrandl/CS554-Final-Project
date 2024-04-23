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
    let newUser = {
        name: name,
        emailAddress: emailAddress,
        profileImg: profileImg,
        publicPlaylist: publicPlaylist,//true if playlists/user is public (can be followed and playlists in main list)
        accountType: type,
        playlists: []
    }
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';
    return {insertedUser: true};
}
const getAccount = async (email) => {
    let em = validation.checkString(email);
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: em});
    if (user === null) throw 'No user account with that email';
    user._id = user._id.toString();
    return user;
}
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
    userExist
}