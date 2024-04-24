import React, {useState} from 'react';
import {doGoogleSignIn, doMicrosoftSignIn, doGithubSignIn} from '../../firebase/FirebaseFunctions';
import axios from "axios";

const SocialSignIn = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const googleSignOn = async () => {
    try {
      let user = await doGoogleSignIn();
      if (typeof user === "string"){
        throw user;
      }
      else{
        //check for if user exists
        const exist = await axios.get('/api/users/userexist', {params: {
            email: user.email
        }});
        console.log(exist.data);
        console.log(user)
        if (!exist.data){
            const response = await axios.post('/api/users/register', {
                displayName: user.displayName,
                email: user.email,
                image: user.photoURL,
                public: false,
                accountType: "google"
            });
            }
      }
    } catch (error) {
        if (typeof error == "string"){
            setErrorMessage(error);
        }
        else{setErrorMessage(error.message)}
    }
  };
  const microsoftSignOn = async () => {
    try {
      let user = await doMicrosoftSignIn();
      if (typeof user === "string"){
        throw user;
      }
      else{
        //check for if user exists
        console.log(user)
        const exist = await axios.get('/api/users/userexist', {params: {
            email: user.email
        }});
        console.log(exist.data);
        console.log(user)
        if (!exist.data){
            const response = await axios.post('/api/users/register', {
                displayName: user.displayName,
                email: user.email,
                image: user.photoURL,
                public: false,
                accountType: "google"
            });
            }
      }
    } catch (error) {
        if (typeof error == "string"){
            setErrorMessage(error);
        }
        else{setErrorMessage(error.message)}
    }
  };
  const githubSignOn = async () => {
    try {
      let user = await doGithubSignIn();
      if (typeof user === "string"){
        throw user;
      }
      else{
        //check for if user exists
        console.log(user)
        const exist = await axios.get('/api/users/userexist', {params: {
            email: user.email
        }});
        console.log(exist.data);
        console.log(user)
        if (!exist.data){
            const response = await axios.post('/api/users/register', {
                displayName: user.displayName,
                email: user.email,
                image: user.photoURL,
                public: false,
                accountType: "google"
            });
            }
      }
    } catch (error) {
        if (typeof error == "string"){
            setErrorMessage(error);
        }
        else{setErrorMessage(error.message)}
    }
  };
  return (
    <div>
        {errorMessage && <h4 className='error'>{errorMessage}</h4>}
      <img
        onClick={() => googleSignOn()}
        alt='google signin'
        src='/imgs/btn_google_signin.png'
      />
      <img
        onClick={() => microsoftSignOn()}
        alt='microsoft signin'
        src='/imgs/btn_microsoft_signin.png'
      />
      <img
        onClick={() => githubSignOn()}
        alt='github signin'
        src='/imgs/github-mark.png'
      />
    </div>
  );
};

export default SocialSignIn;