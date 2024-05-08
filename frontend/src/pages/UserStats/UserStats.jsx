import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './UserStats.css';
import { AuthContext } from "../../firebase/Auth";

export const UserStats = () => {
  const [stats, setStats] = useState(null);
  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`api/users/userStats?userEmail=${currentUser.email}`);
        console.log(response.data)
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  if (!currentUser){
    return <div className="not-current-user"><br />You must be logged in to access this page!</div>
  }

  return (
    <div className="user-stats">
      <br />
      <h2>Your Stats</h2>
      <br />
      <hr />
      
      <section className="user-rel-stats">
        <h3>User-Related Statistics</h3>
        <div>
          <p>Followed Users: {stats.followedUsers}</p>
          <p>Followers: {stats.followers}</p>
        </div>
      </section>

      <hr /> 

      <section className="playlist-stats">
        <h3>Playlist-Related Statistics</h3>
        <div>
          <p>Playlists Created: {stats.playlistsCreated}</p>
          <p>Saved Playlists: {stats.savedPlaylists}</p>
        </div>
      </section>

      <hr /> 

      <section className="song-stats">
        <h3>Song-Related Statistics</h3>
        <div>
          <p>Total Number of Songs Added to Playlists: {stats.songsAdded}</p>
          <br />
          {stats.songsAdded > 0 &&
          <><h4>Songs per Artist:</h4>
          {stats.songsPerArtist && Object.entries(stats.songsPerArtist).map(([artist, count]) => (
            <p key={artist}>{artist}: {count}</p>
          ))}
          <br />
          <h4>Songs per Album:</h4>
          {stats.songsPerAlbum && Object.entries(stats.songsPerAlbum).map(([album, count]) => (
            <p key={album}>{album}: {count}</p>
          ))}</>}
        </div>
        <br />
      </section>
    </div>
  );
};