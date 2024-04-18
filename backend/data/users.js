import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
const registerUser = async (
    name,
    emailAddress,
    profileImg
) => {
    let newUser = {
        name: name,
        emailAddress: emailAddress,
        profileImg: profileImg,
        playlists: []
    }
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';
    return {insertedUser: true};
}
const getAccount = async (id) => {
    const userCollection = await users();
}
export default {
    registerUser,
    getAccount
}