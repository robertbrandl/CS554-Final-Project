import { useEffect, useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";

export const AccountPlaylists = ({ user }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    setError('');
    const fetchData = async () => {
      console.log("user = ", user);
      const email = user.email;
      console.log("user.email = ", user.email);
      let response = null;
      try{
        response = await axios.put(
        "http://localhost:3000/playlists/myplaylists",
        { email }
      );
      }catch(e){
        response = e;
      }
      if (response && response.status && response.status === 200) {
        // Update the playlists state with the received playlists
        setPlaylists(response.data.playlists);
        console.log("users playlist have been found");
      } else {
        setError("Failed to fetch user playlists");
      }
    };

    fetchData();
  }, []);
  if (error){
    return <div>{error}</div>
  }
  async function deletePlaylist(playlistId, userEmail) {
    console.log("delete clicked");
    console.log(userEmail)
    const response = await axios.delete(
      "http://localhost:3000/playlists/myplaylists",
      {
        data: { playlistId, userEmail },
      }
    );
    if (response.status === 200) {
      console.log("users playlist have been deleted");
      window.alert("Playlist deleted successfully");
      window.location.reload();
    } else {
      console.error("Failed to deleted user playlists:", response.data.error);
    }
  }

  async function editPlaylist(playlistId, userEmail) {
    navigate(`/playlist/editplaylist/${playlistId}`);
  }
  return (
    <div className="item-holder">
      {playlists && (
        <div>
          <ul>
            {playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <li key={index}>
                  <Link
                    className="linker"
                    key={index}
                    to={`/playlist/${playlist._id}`}
                  >
                    <span>{playlist.title}</span>
                    <span className="created-by">
                      Created By: {playlist.userName}
                    </span>

                    <span className="genre">
                      {formatDate(playlist.dateCreated)}
                    </span>
                    <span className="genre">Genre: {playlist.genre}</span>
                  </Link>
                  {currentUser && user.email === currentUser.email && (
                    <div>
                      <button
                        className="delete-playlist-button"
                        onClick={() => deletePlaylist(playlist._id, user.email)}
                      >
                        Delete Playlist
                      </button>
                      <button
                        className="edit-playlist-button"
                        onClick={() => editPlaylist(playlist._id, user.email)}
                      >
                        Edit Playlist
                      </button>
                    </div>
                  )}

                </li>
              ))
            ) : (
              <li>No Playlists Created</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
