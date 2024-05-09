import {dbConnection, closeConnection} from './config/mongoConnection.js';
import users from './data/users.js';
import playlists from "./data/playlists.js";
import songs from "./data/songs.js";
async function seedDatabase() {
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    //create 5 users
    await users.registerUser("Robert Brandl", "robert@email.com", true, "email", "password123!");
    await users.registerUser("Krystal Hong", "krystal@email.com", true, "email", "password123!");
    await users.registerUser("Rivaldo D Silva", "rivaldo@email.com", false, "email", "password123!");
    await users.registerUser("Linette Santana Encarnacion", "linette@email.com", false, "email", "password123!");
    await users.registerUser("Areeb Chaudhry", "areeb@email.com", true, "email", "password123!");
    
    //access their accounts and ids to make playlists
    let u1acc = await users.getAccount("robert@email.com");
    let u2acc = await users.getAccount("krystal@email.com");
    let u3acc = await users.getAccount("rivaldo@email.com");
    let u4acc = await users.getAccount("linette@email.com");
    let u5acc = await users.getAccount("areeb@email.com");
    
    //create 2 playlists per user!
    let playlist1 = await playlists.createPlaylist("Robert's Playlist", u1acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Pop");
    let playlist2 = await playlists.createPlaylist("Playlist 1", u1acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Folk");
    let playlist3 = await playlists.createPlaylist("Krystal's Playlist", u2acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "K-POP");
    let playlist4 = await playlists.createPlaylist("Playlist 2", u2acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Electronic");
    let playlist5 = await playlists.createPlaylist("Rivaldo's Playlist", u3acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "No Genre");
    let playlist6 = await playlists.createPlaylist("Playlist 3", u3acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Metal");
    let playlist7 = await playlists.createPlaylist("Linette's Playlist", u4acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Latin");
    let playlist8 = await playlists.createPlaylist("Playlist 4", u4acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Rap");
    let playlist9 = await playlists.createPlaylist("Areeb's Playlist", u5acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Rock");
    let playlist10 = await playlists.createPlaylist("Playlist 5", u5acc._id.toString(), "https://res.cloudinary.com/ddnqdbdci/image/upload/v1715037599/cld-sample-2.jpg", "Pop");
    //songs
    await songs.addSongToPlaylist('2757495911', playlist1.insertedId.toString());
    await songs.addSongToPlaylist('135971346', playlist1.insertedId.toString());
    await songs.addSongToPlaylist('75768727', playlist2.insertedId.toString());
    await songs.addSongToPlaylist('15188926', playlist2.insertedId.toString());
    await songs.addSongToPlaylist('1256485832', playlist3.insertedId.toString());
    await songs.addSongToPlaylist('841857692', playlist3.insertedId.toString());
    await songs.addSongToPlaylist('63017512', playlist4.insertedId.toString());
    await songs.addSongToPlaylist('120738996', playlist4.insertedId.toString());
    await songs.addSongToPlaylist('938978422', playlist5.insertedId.toString());
    await songs.addSongToPlaylist('2237825177', playlist5.insertedId.toString());
    await songs.addSongToPlaylist('136408368', playlist6.insertedId.toString());
    await songs.addSongToPlaylist('2569593922', playlist6.insertedId.toString());
    await songs.addSongToPlaylist('2496106541', playlist7.insertedId.toString());
    await songs.addSongToPlaylist('2758436071', playlist7.insertedId.toString());
    await songs.addSongToPlaylist('598181792', playlist8.insertedId.toString());
    await songs.addSongToPlaylist('980939762', playlist8.insertedId.toString());
    await songs.addSongToPlaylist('94901886', playlist9.insertedId.toString());
    await songs.addSongToPlaylist('65126049', playlist9.insertedId.toString());
    await songs.addSongToPlaylist('15172255', playlist10.insertedId.toString());
    await songs.addSongToPlaylist('1161946042', playlist10.insertedId.toString());

    //following users
    await users.followUser(u1acc.emailAddress, u2acc._id)
    await users.followUser(u1acc.emailAddress, u5acc._id)
    await users.followUser(u2acc.emailAddress, u1acc._id)
    await users.followUser(u2acc.emailAddress, u5acc._id)
    await users.followUser(u3acc.emailAddress, u1acc._id)
    await users.followUser(u3acc.emailAddress, u2acc._id)
    await users.followUser(u4acc.emailAddress, u5acc._id)
    await users.followUser(u5acc.emailAddress, u2acc._id)

    //saving playlists
    await users.savePlaylist(u1acc.emailAddress, playlist3.insertedId.toString())
    await users.savePlaylist(u1acc.emailAddress, playlist10.insertedId.toString())
    await users.savePlaylist(u2acc.emailAddress, playlist1.insertedId.toString())
    await users.savePlaylist(u2acc.emailAddress, playlist9.insertedId.toString())
    await users.savePlaylist(u3acc.emailAddress, playlist2.insertedId.toString())
    await users.savePlaylist(u4acc.emailAddress, playlist4.insertedId.toString())
    await users.savePlaylist(u5acc.emailAddress, playlist1.insertedId.toString())
    await users.savePlaylist(u5acc.emailAddress, playlist2.insertedId.toString())
    await users.savePlaylist(u5acc.emailAddress, playlist3.insertedId.toString())
    
    console.log('Done seeding database');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await closeConnection();
  }
}

seedDatabase();