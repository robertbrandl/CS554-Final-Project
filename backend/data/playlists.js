import {ObjectId} from 'mongodb';
import * as validation from '../validation.js';
import {playlists} from '../config/mongoCollections.js';
import {synchronizeData} from "../config/elasticSync.js" ;
const getPlaylist = async (
    playlistId
) => {
    let id = undefined;
    try{
        id = validation.checkString(playlistId);
    }catch(e){
        throw {code: 400, error: e};
    }
    if (!ObjectId.isValid(playlistId)) {
        throw {code: 400, error: 'Invalid playlist ID format'};
    }
    const playlistCollection = await playlists();
    let playlist = undefined;
    try{
        playlist = await playlistCollection.findOne({ _id: ObjectId(id) });
    }catch(e){
        throw {code: 500, error: "Internal Server Error"};
    }
    if (!playlist) {
        throw {code: 404, error: `Playlist with ID ${playlistId} not found`};
    }
    return playlist;
}
const getAllPlaylists = async() =>{
    const playlistCollection = await playlists();
    let allPlaylists = undefined;
    try{
        allPlaylists = await playlistCollection.find({}).toArray();
    }catch(e){
        throw e.message || e;
    }
    await synchronizeData();
    return allPlaylists;
}
export default {getPlaylist, getAllPlaylists};