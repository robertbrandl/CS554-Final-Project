import "./Signup.css";
import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../../firebase/FirebaseFunctions';
import {AuthContext} from '../../firebase/Auth';
import axios from "axios";
//import SocialSignIn from './SocialSignIn';
export const Signup = () => {
  const {currentUser} = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSignUp = async (e) => {
    e.preventDefault();
    const {displayName, email, passwordOne, passwordTwo, profileImage} = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
      const response = await axios.post('/api/users/register', {
        displayName: displayName.value,
        email: email.value,
        image: profileImage
      });
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  return (
    <div className='card'>
      <h1>Sign up</h1>
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
