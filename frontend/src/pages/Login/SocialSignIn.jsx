import React from 'react';
import {doGoogleSignIn} from '../../firebase/FirebaseFunctions';
import axios from "axios";

const SocialSignIn = () => {
  
  const socialSignOn = async () => {
    try {
      let user = await doGoogleSignIn();
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
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn()}
        alt='google signin'
        src='/imgs/btn_google_signin.png'
      />
    </div>
  );
};

export default SocialSignIn;