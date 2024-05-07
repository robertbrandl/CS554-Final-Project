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
      <h2>User Stats</h2>
      <p>Followed Users: {stats.followedUsers}</p>
      <p>Followers: {stats.followers}</p>
      <p>Playlists Created: {stats.playlistsCreated}</p>
      <div>
        <h3>Songs per Artist:</h3>
        {stats.songsPerArtist && Object.entries(stats.songsPerArtist).map(([artist, count]) => (
          <p key={artist}>{artist}: {count}</p>
        ))}
      </div>
    </div>
  );
};