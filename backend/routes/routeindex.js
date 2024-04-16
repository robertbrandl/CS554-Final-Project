import userRoutes from "./users.js";
const configRoutes = (app) => {
  app.use('/users', userRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configRoutes;
