import "./Signup.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../../firebase/FirebaseFunctions';
import {AuthContext} from '../../firebase/Auth';
import axios from "axios";
import SocialSignIn from '../Login/SocialSignIn';
import {Typography} from "@mui/material";
export const Signup = () => {
  const {currentUser} = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSignUp = async (e) => {
    e.preventDefault();
    const {displayName, email, passwordOne, passwordTwo, publicPlaylists} = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    try {
      setLoading(true);
      console.log(displayName.value)
      console.log(email.value)
      console.log(publicPlaylists.checked)
      try{
      const response = await axios.post('/api/users/register', {
        displayName: displayName.value,
        email: email.value,
        public: publicPlaylists.checked,
        accountType: "email",
        password: passwordOne.value
      });
      
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
      console.log(currentUser)
      setErrorMessage('');
      setLoading(false);
      }catch(e){
        console.log(e)
        setErrorMessage(e.response.data.message || e.response.data.error || e.message);
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  if (loading){
    return <div>Loading...</div>
  }

  return (
    <div className="signup">
      <h4>Sign up</h4>
      <SocialSignIn />
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <form onSubmit={handleSignUp}>
        <div className='text_area'>
            <br />
            <input
              required
              name='displayName'
              type='text'
              placeholder='Name'
              className="text_input"
              autoFocus={true}
            />
        </div>
        <div className='text_area'>
            <br />
            <input
              className="text_input"
              required
              name='email'
              type='email'
              placeholder='Email'
            />
        </div>
        <p>Password must be at least 8 characters with no spaces, contain a number, and contain a special character (such as !, ?, @, #, etc.).</p>
        <br />
        <div className='text_area'>
            <br />
            <input
              className="text_input"
              id='passwordOne'
              name='passwordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
        </div>
        <div className='text_area'>
            <br />
            <input
              name='passwordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              className="text_input"
              required
            />
        </div>
        <br />
        <br />
        <div className='form-group'>
          <label>
            Check the box if you would like to make your playlists public:  
            <input
              className='form-check-input'
              name='publicPlaylists'
              type='checkbox'
            />
          </label>
        </div>
        <button
          className='btn'
          id='submitButton'
          name='submitButton'
          type='submit'
        >
          Sign Up
        </button>
      </form>
      <br />
    </div>
  );
}
