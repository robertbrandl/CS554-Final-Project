import userRoutes from "./users.js";
import songRoutes from "./songs.js"
const configRoutes = (app) => {
  app.use('/users', userRoutes);
  app.use('/songs', songRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configRoutes;
