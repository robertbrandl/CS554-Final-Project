import React, { useState, useContext } from "react";
import axios from "axios"; // Import Axios
import "./CreatePlaylist.css";
import { AuthContext } from "../../firebase/Auth";
export const CreatePlaylist = () => {
  const [formData, setFormData] = useState({
    title: "",
    userName: "",
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
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        "http://localhost:3000/playlists/createplaylist",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
  return (
    <div className="create-playlist">
      <h1>CreatePlaylist</h1>
      <form className="create-playlist-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="title">Title:</label>{" "}
          <input type="text" name="title" id="title" onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="userName">User Name:</label>{" "}
          <input
            type="text"
            name="userName"
            id="userName"
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="albumCover" className="album-cover-label">
            Album Cover:
          </label>
          <input
            type="file"
            name="albumCover"
            id="albumCover"
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="genre">Genre:</label>{" "}
          <input type="text" name="genre" id="genre" onChange={handleChange} />
        </div>
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
};
