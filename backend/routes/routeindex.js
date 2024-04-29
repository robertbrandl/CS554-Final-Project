import userRoutes from "./users.js";
import songRoutes from "./songs.js";
import playlistRoutes from "./playlists.js"
const configRoutes = (app) => {
  app.use('/users', userRoutes);
  app.use('/songs', songRoutes);
  app.use('/playlists', playlistRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configRoutes;
