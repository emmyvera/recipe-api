module.exports = {
  database: "recipes_db",
  username: "root",
  password: "secret",
  params: {
    dialect: "mysql",
    logging: false,
    define: {
      underscored: true,
    },
  },
  jwtSecret: "Recipe$-AP1",
  jwtSession: { session: false },
};
