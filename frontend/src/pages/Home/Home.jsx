import { SpotifyDashboard } from "../SpotifyDashboard/SpotifyDashboard";
import "./Home.css";

const code = new URLSearchParams(window.location.search).get("code");
export const Home = () => {
  return (
    <div>
      Home
      {code && <SpotifyDashboard code={code} />}
    </div>
  );
};
