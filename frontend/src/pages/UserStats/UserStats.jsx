import "./UserStats.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
export const UserStats = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='card'>
      <h1>See your Music Statistics</h1>
    </div>
  );
}
