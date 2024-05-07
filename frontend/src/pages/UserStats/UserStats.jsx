import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserStats.css';

export const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
export const UserStats = () => {
  const [stats, setStats] = useState(null);
  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/userStats?userId=${userId}`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchStats();
  }, [userId]);

  if (!stats) {
    return <div>Loading...</div>;
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