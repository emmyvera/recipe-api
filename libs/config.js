module.exports = (app) => {
  const env = process.env.NODE_ENV;
  if (env) {
    return require(`./config.${env}.js`);
  } else {
    return require("./config.development.js");
  }
};
