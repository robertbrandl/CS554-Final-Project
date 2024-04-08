import "./SongSearch.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
export const SongSearch = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='card'>
      <h1>Browse Songs for your Playlist</h1>
    </div>
  );
}
