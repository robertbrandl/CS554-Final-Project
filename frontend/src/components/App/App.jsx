import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "../../pages/Home/Home";
import { Login } from "../../pages/Login/Login";
import { Signup } from "../../pages/Signup/Signup";
import { UserAccount } from "../../pages/UserAccount/UserAccount";
import { SongSearch } from "../../pages/SongSearch/SongSearch";
import { NotFound } from "../../pages/NotFound/NotFound";
import { UserStats } from "../../pages/UserStats/UserStats";
import { GenPlaylists } from "../../pages/GenPlaylists/GenPlaylists";
import { FollowedPlaylists } from "../../pages/FollowedPlaylists/FollowedPlaylists";
import { Navbar } from "../Navbar/Navbar";
import { Mainbar } from "../Mainbar/Mainbar";
import { AuthProvider } from "../../firebase/Auth";
import { SingleSong } from "../../pages/SingleSong/SingleSong";
import { SinglePlaylist } from "../../pages/SinglePlaylist/SinglePlaylist";
import { SpotifyAuth } from "../../pages/Login/SpotifyAuth";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Mainbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/songsearch" element={<SongSearch />} />
        <Route exact path="/account" element={<UserAccount />} />
        <Route exact path="/statistics" element={<UserStats />} />
        <Route exact path="/allplaylists" element={<GenPlaylists />} />
        <Route
          exact
          path="/followedplaylists"
          element={<FollowedPlaylists />}
        />
        <Route exact path="/spotifyauth" element={<SpotifyAuth />} />
        <Route exact path="/song/:id" element={<SingleSong />} />
        <Route exact path="/playlist/:id" element={<SinglePlaylist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
