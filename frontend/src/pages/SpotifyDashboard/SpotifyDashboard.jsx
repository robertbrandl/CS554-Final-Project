import useAuth from "../../hooks/useAuth";

export const SpotifyDashboard = ({ code }) => {
  const accessToken = useAuth(code);
  return (
    <div>
      <h1>SpotifyDashboard</h1>
      {code && <h1>{code}</h1>}
    </div>
  );
};
