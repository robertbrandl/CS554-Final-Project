const configRoutes = (app) => {
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configRoutes;
