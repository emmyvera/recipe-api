import logger from "./logger.js";
require("dotenv").config();

module.exports = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  params: {
    dialect: "sqlite",
    storage: "recipes_db.sqlite",
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true,
    },
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: { session: false },
};
