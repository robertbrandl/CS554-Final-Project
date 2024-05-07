import {dbConnection, closeConnection} from './config/mongoConnection.js';
import users from './data/users.js';
import playlists from "./data/playlists.js";

async function seedDatabase() {
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    //create 5 users
    await users.registerUser("Robert Brandl", "robert@email.com", true, "email");
    await users.registerUser("Krystal Hong", "krystal@email.com", true, "email");
    await users.registerUser("Rivaldo D Silva", "rivaldo@email.com", false, "email");
    await users.registerUser("Linette Santana Encarnacion", "linette@email.com", false, "email");
    await users.registerUser("Areeb Chaudhry", "areeb@email.com", true, "email");
    
    //access their accounts and ids to make playlists
    let u1acc = await users.getAccount("robert@email.com");
    let u2acc = await users.getAccount("krystal@email.com");
    let u3acc = await users.getAccount("rivaldo@email.com");
    let u4acc = await users.getAccount("linette@email.com");
    let u5acc = await users.getAccount("areeb@email.com");

    //create 2 playlists per user!
    let playlist1 = await playlists.createPlaylist("Robert's Playlist", u1acc._id.toString(), "robert", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Pop");
    let playlist2 = await playlists.createPlaylist("Playlist 1", u1acc._id.toString(), "robert", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Folk");
    let playlist3 = await playlists.createPlaylist("Krystal's Playlist", u2acc._id.toString(), "krystal", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "KPOP");
    let playlist4 = await playlists.createPlaylist("Playlist 2", u2acc._id.toString(), "krystal", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Electronic");
    let playlist5 = await playlists.createPlaylist("Rivaldo's Playlist", u3acc._id.toString(), "rivaldo", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "No Genre");
    let playlist6 = await playlists.createPlaylist("Playlist 3", u3acc._id.toString(), "rivaldo", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Metal");
    let playlist7 = await playlists.createPlaylist("Linette's Playlist", u4acc._id.toString(), "linette", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Latin");
    let playlist8 = await playlists.createPlaylist("Playlist 4", u4acc._id.toString(), "linette", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Rap");
    let playlist9 = await playlists.createPlaylist("Areeb's Playlist", u4acc._id.toString(), "linette", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Rock");
    let playlist10 = await playlists.createPlaylist("Playlist 5", u5acc._id.toString(), "linette", "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Pop");

    console.log('Done seeding database');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await closeConnection();
  }
}

seedDatabase();