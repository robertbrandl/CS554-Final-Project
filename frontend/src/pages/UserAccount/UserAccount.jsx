import "./UserAccount.css";
import React, {useContext, useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import {
  doPasswordReset,
} from "../../firebase/FirebaseFunctions";
import axios from "axios";
export const UserAccount = () => {
  const {currentUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [data, setData] = useState({})
  console.log(currentUser)
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
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
    fetchData();
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
    return <div>Error: {errorMessage}</div>
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
    </div>
  );
}
