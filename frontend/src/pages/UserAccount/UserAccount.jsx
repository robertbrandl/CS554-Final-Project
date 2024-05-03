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
        setData(data);
        console.log(data)
        console.log(data.profileImg)
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
      <div>
        <img src={data.profileImg} alt="Profile Image" />
      </div>
      {data.publicPlaylist ? <p>Your playlists and account is public!</p> : <p>Your playlists and account is private. This means you cannot be followed by other users.</p>}
    </div>
  );
}
