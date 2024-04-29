import "./Signup.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../../firebase/FirebaseFunctions';
import {AuthContext} from '../../firebase/Auth';
import axios from "axios";
import SocialSignIn from '../Login/SocialSignIn';
export const Signup = () => {
  const {currentUser} = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const handleSignUp = async (e) => {
    e.preventDefault();
    const {displayName, email, passwordOne, passwordTwo, profileImage, publicPlaylists} = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    try {
      setLoading(true);
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
      console.log(displayName.value)
      console.log(email.value)
      console.log(profileImage.files[0])
      console.log(publicPlaylists.checked)
      const response = await axios.post('/api/users/register', {
        displayName: displayName.value,
        email: email.value,
        image: URL.createObjectURL(profileImage.files[0]),
        public: publicPlaylists.checked,
        accountType: "email"
      });
      setErrorMessage('');
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  if (loading){
    return <div>Loading...</div>
  }

  return (
    <div className='card'>
      <h1>Sign up</h1>
      <SocialSignIn />
      {errorMessage && <h4 className='error'>{errorMessage}</h4>}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          <label>
            Name:
            <br />
            <input
              className='form-control'
              required
              name='displayName'
              type='text'
              placeholder='Name'
              autoFocus={true}
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Email:
            <br />
            <input
              className='form-control'
              required
              name='email'
              type='email'
              placeholder='Email'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Password:
            <br />
            <input
              className='form-control'
              id='passwordOne'
              name='passwordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Confirm Password:
            <br />
            <input
              className='form-control'
              name='passwordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Profile Image:
            <br />
            <input
              className='form-control'
              name='profileImage'
              type='file'
              accept='image/*'
              required
            />
          </label>
        </div>
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
          className='button'
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
