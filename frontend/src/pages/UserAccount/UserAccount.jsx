import "./UserAccount.css";
import React, {useContext, useState, useEffect} from 'react';
import {Navigate, useParams} from 'react-router-dom';
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
  const [isFollowing, setIsFollowing] = useState(false);
  //const { id } = useParams();
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
        setData(data);
        console.log(data)
        console.log(data.profileImg)
        setErrorMessage('');
        setLoading(false);
      } catch (e) {
        setErrorMessage(e.message);
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
  const handleFollow = async () => {
    setLoading(true);
    setIsFollowing(!isFollowing);
    if (isFollowing){
      const response = await axios.patch('/api/users/follow', {
        email: currentUser.email,
        followId: id
      });
    }
    else{
      const response = await axios.patch('/api/users/unfollow', {
        email: currentUser.email,
        unfollowId: id
      });
    }
    setLoading(false);
  };
  
  if (loading){
    return <div>Loading...</div>
  }
  else if (errorMessage){
    return <div>Error: {errorMessage}</div>
  }
  if (!currentUser){
    return <div>You must be logged in to access this page!</div>
  }
  return (
    <div className='card'>
      <h1>Your Account</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.emailAddress}</p>
      {sentEmail && <h4 >{sentEmail}</h4>}
      {data.accountType === "email" &&
      <button className="forgotPassword" onClick={passwordReset}>
        Reset Password
      </button>}
      <div>
        <img src={data.profileImg} alt="Profile Image" />
      </div>
      {data.publicPlaylist ? <>Your playlists and account is public!</> : <>Your playlists and account is private. This means you cannot be followed by other users.</>}
      {currentUser && data.publicPlaylist && data.emailAddress !== currentUser.email && (
        <button onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
}
