import React, { useState, useContext } from "react";
import axios from "axios"; // Import Axios
import "./CreatePlaylist.css";
import { AuthContext } from "../../firebase/Auth";
export const CreatePlaylist = () => {
  const [formData, setFormData] = useState({
    title: "",
    albumCover: null,
    genre: "",
  });
  const { currentUser } = useContext(AuthContext);
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
      const formDataToSend = new FormData();
      formDataToSend.append("email", currentUser.email);
      formDataToSend.append("userName", currentUser.displayName)
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await axios.post(
        "http://localhost:3000/playlists/createplaylist",
        formDataToSend
      );

      if (response.status === 200) {
        window.alert("Form data submitted successfully!");
      } else {
        window.alert("Form submission failed");
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
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
  return (
    <div className="create-playlist">
      <h1>CreatePlaylist</h1>
      <form className="create-playlist-form" onSubmit={handleSubmit}>
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
