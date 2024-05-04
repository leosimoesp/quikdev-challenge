const dotenv = require('dotenv');
dotenv.config();

const Parameters = () => {
  const getEnv = (envName) => {
    return process.env[envName];
  };

  return {
    getEnv,
  };
};
module.exports = Parameters;
