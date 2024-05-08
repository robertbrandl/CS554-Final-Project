import { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./EditPlaylist.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
export const EditPlaylist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [unauth, setUnauth] = useState(false)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    userName: "",
    albumCover: null,
    genre: "",
  });
  const [playlistData, setPlaylistData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    //setError("");
    setUnauth(false);
    async function fetchData() {
      //setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/playlists/playlist/${id}`
        );
        console.log(response.data);
        setFormData({
          title: response.data.playlist.title,
          userName: response.data.playlist.userName,
          genre: response.data.playlist.genre,
          // Ensure albumCover is set to null or a file object
          albumCover: response.data.playlist.albumCover,
        });
      } catch (e) {
        console.log(e)
        if (e && e.response && e.response.status && e.response.status == 403){
          setUnauth(true)
        }
        //setError(e.message);
      }
      //setLoading(false);
    }
    fetchData();
  }, [id]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      console.log("in handlesubmit");
      const formDataToSend = new FormData();
      formDataToSend.append("email", currentUser.email);
      Object.entries(formData).forEach(([key, value]) => {
        console.log(key)
        console.log(value);
        formDataToSend.append(key, value);
      });
      console.log(formData)

      const response = await axios.patch(
        `http://localhost:3000/playlists/editplaylist/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        window.alert("playlist updated submitted successfully!");
        navigate(-1);
      } else {
        window.alert("Form submission failed");
        console.error("Form submission failed:", response.statusText);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error || error.message);
      setLoading(false);
    }
  };
  const genres = ["Rock", "Pop", "Hip Hop", "R&B", "Country", "Electronic", "Latin", "K-POP", "Classical", "Metal", "Alternative", "Folk", "Rap", "Gospel"];
  if (unauth){
    return <div className="error-gen">You are not authorized to edit this playlist.</div>
  }
  if (loading){
    return <div>Loading...</div>
  }
  return (
    <div className="create-playlist">
      <h1>Edit Playlist</h1>
      <form className="create-playlist-form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div>*Playlist title must be between 1 and 50 characters.*</div>
        <div className="form-row">
          <label htmlFor="title">Title:</label>{" "}
          <input type="text" name="title" id="title" onChange={handleChange} value={formData.title}  />
        </div>
        <div className="form-row">
          <label htmlFor="albumCover" className="album-cover-label">
            Playlist Cover Image:
          </label>
          <input
            type="file"
            name="albumCover"
            id="albumCover"
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="genre">Choose a Playlist Genre:</label>{" "}
          <select name="genre" id="genre" value={formData.genre} onChange={handleChange}>
            <option value="">Select Genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
            <option value="No Genre">No Genre</option>
          </select>
        </div>
        <button type="submit">Edit Playlist</button>
      </form>
    </div>
  );
};
