import {ObjectId} from 'mongodb';
import * as validation from '../validation.js';
import {users} from '../config/mongoCollections.js';
import gm from "gm";
import fs from "fs";
import request from "request"
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
    // Convert the Blob to a buffer
    // Define the URL of the image
const imageUrl = 'https://graph.facebook.com/972859617758177/picture';

// Define the local file path to save the downloaded image
const localImagePath = 'temp-profile-img.jpg';

// Download the image from the URL
request(imageUrl)
  .pipe(fs.createWriteStream(localImagePath))
  .on('close', () => {
    // Once the image is downloaded, resize it using GraphicsMagick or ImageMagick
    gm(localImagePath)
      .options({imageMagick: true}) // Enable ImageMagick mode
      .resize(200, 200)
      .write('resized-profile-img.jpg', (err) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('Image resized successfully.');
        }
      });
  });

    let newUser = {
        name: name,
        emailAddress: emailAddress,
        profileImg: profileImg,
        publicPlaylist: publicPlaylist,//true if playlists/user is public (can be followed and playlists in main list)
        accountType: type,
        playlists: [],
        followedUsers: []
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