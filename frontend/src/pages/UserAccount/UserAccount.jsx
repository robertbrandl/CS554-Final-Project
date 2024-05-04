import "./UserAccount.css";
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../firebase/Auth';
import {
  doPasswordReset,
} from "../../firebase/FirebaseFunctions";
import axios from "axios";

export const UserAccount = () => {
  const {currentUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [data, setData] = useState({})
  console.log(currentUser)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const {data} = await axios.get('/api/users/account', {
          params: {
            email: currentUser.email
          }
        });
        let followed = data.followedUsers;
        let playlists = data.playlists;
        let savedPlaylists = data.savedPlaylists;
        if (data.publicPlaylist){
          setIsPublic(true);
        }
        setData(data);
        console.log(data)
        setErrorMessage('');
        setLoading(false);
      } catch (e) {
        setErrorMessage(e.response.data.error);
        setLoading(false);
      }
    }
    if (currentUser){
    fetchData();
    }
  }, []);

  const passwordReset = (event) => {
    event.preventDefault();
    let email = currentUser.email;
    if (email) {
      doPasswordReset(email);
      setSentEmail("An email was sent for you to reset your password!");
      setErrorMessage('');
    } else {
      setErrorMessage(
        "Please enter an email address below before you click the forgot password link"
      );
      setSentEmail('');
    }
  };
  const handlePublic = async () => {
    setLoading(true);
    console.log(isPublic)
    if (isPublic === false){
      const response = await axios.patch('/api/users/setpublic', {
        email: currentUser.email
      });
    }
    else{
      const response = await axios.patch('/api/users/setprivate', {
        email: currentUser.email
      });
    }
    setIsPublic(!isPublic);
    setLoading(false);
  };
  
  if (loading){
    return <div>Loading...</div>
  }
  else if (errorMessage){
    return <div>{errorMessage}</div>
  }
  if (!currentUser){
    return <div>You must be logged in to access this page!</div>
  }
  return (
    <div className='account'>
      <h1>Your Account</h1>
      <h4>Name: {data.name}</h4>
      <p>Email: {data.emailAddress}</p>
      {sentEmail && <h4 >{sentEmail}</h4>}
      {data.accountType === "email" &&
      <button className="btn" onClick={passwordReset}>
        Reset Password
      </button>}
      {data.publicPlaylist ? <p>Your playlists and account is public and you can be followed by anyone!</p> : <p>Your playlists and account is private. This means you cannot be followed by other users.</p>}
      <button onClick={handlePublic} className="btn">
          {isPublic ? 'Make Account Private' : 'Make Account Public'}
      </button>
    </div>
  );
}
