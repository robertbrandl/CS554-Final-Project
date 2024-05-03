import "./PublicUser.css";
import React, {useContext, useState, useEffect} from 'react';
import {Navigate, useParams, Link} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import axios from "axios";

export const PublicUser = () => {
  const {currentUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState({})
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = useParams();
  console.log(currentUser)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const {data} = await axios.get('/api/users/profile', {
          params: {
            userId: id
          }
        });
        const {data: loggedInUser} = await axios.get('/api/users/account', {
            params: {
              email: currentUser.email
            }
          });
        console.log(loggedInUser)
        console.log(id)
        if (loggedInUser.followedUsers.includes(id.toString())) {
            setIsFollowing(true);
        }
        let playlists = data.playlists;
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
  }, [id]);

  const handleFollow = async () => {
    setLoading(true);
    console.log(isFollowing)
    if (isFollowing === false){
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
    setIsFollowing(!isFollowing);
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
    <div className='profile'>
      <h1>User Profile</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.emailAddress} {data.publicPlaylist}</p>
      <div>
        <img src={data.profileImg} alt="Profile Image" />
      </div>
      {currentUser && data.publicPlaylist && data.emailAddress !== currentUser.email && (
        <button onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
      {data.playlists && data.playlists.length > 0 ? (
          <div>
            <h2>Playlists:</h2>
            <ul>
              {data.playlists.map((playlist) => (
                <li key={playlist._id}><Link to={`/playlist/${playlist._id}`}>{playlist.name}</Link></li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No playlists available.</p>
        )}
    </div>
  );
}
