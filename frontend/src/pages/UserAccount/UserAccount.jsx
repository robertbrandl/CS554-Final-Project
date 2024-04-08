import "./UserAccount.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
export const UserAccount = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='card'>
      <h1>Your Account</h1>
    </div>
  );
}
