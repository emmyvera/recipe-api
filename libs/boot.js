module.exports = (app) => {
  app.db.sequelize
    .sync()
    .then(() => {
      app.listen(app.get("port"), () => {
        console.log(`Recipe API - Port ${app.get("port")}`);
      });
    })
    .catch((error) => {
      console.error("Error synchronizing database:", error);
    });
};

module.exports = (app) => {
  if (process.env.NODE_ENV !== "test") {
    app.db.sequelize
      .sync()
      .then(() => {
        app.listen(app.get("port"), () => {
          console.log(`Recipe API - Port ${app.get("port")}`);
        });
      })
      .catch((error) => {
        console.error("Error synchronizing database:", error);
      });
  }
};
