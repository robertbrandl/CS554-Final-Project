import "./FollowedPlaylists.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
export const FollowedPlaylists = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='card'>
      <h1>View and Search Through Playlists from Your Followed Users</h1>
    </div>
  );
}
