import "./GenPlaylists.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
export const GenPlaylists = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='card'>
      <h1>View and Search Through All Playlists</h1>
    </div>
  );
}
