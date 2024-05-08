import React, { useState, useContext } from "react";
import axios from "axios"; // Import Axios
import "./CreatePlaylist.css";
import { AuthContext } from "../../firebase/Auth";
import { useNavigate } from "react-router-dom";
export const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    albumCover: null,
    genre: "",
  });
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    setError('');
    event.preventDefault();

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("email", currentUser.email);
      // formDataToSend.append("userName", currentUser.displayName)
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await axios.post(
        "http://localhost:3000/playlists/createplaylist",
        formDataToSend
      );

      if (response.status === 200) {
        window.alert("Form data submitted successfully!");
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
  const genres = [
    "Rock",
    "Pop",
    "Hip Hop",
    "R&B",
    "Country",
    "Electronic",
    "Latin",
    "K-POP",
    "Classical",
    "Metal",
    "Alternative",
    "Folk",
    "Rap",
    "Gospel",
  ];
  if (loading){
    return <div>Loading...</div>
  }
  return (
    <div className="create-playlist">
      <h1>CreatePlaylist</h1>
      <form className="create-playlist-form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div>*Playlist title must be between 1 and 50 characters.*</div>
      <br />
        <div className="form-row">
          <label htmlFor="title">Title:</label>{" "}
          <input type="text" name="title" id="title" onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="albumCover" className="album-cover-label">
            Add a Playlist Cover Image:
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
          <select name="genre" id="genre" onChange={handleChange}>
            <option value="">Select Genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
            <option value="No Genre">No Genre</option>
          </select>
        </div>
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
};
