const jwt = require('jsonwebtoken');

const JwtSigner = () => {
  const sign = async (data, secret, expiresTimeIn) => {
    return jwt.sign(data, secret, {
      expiresIn: expiresTimeIn,
    });
  };
  const verify = async (token, secret) => {
    let cleanedToken;
    if (token) {
      cleanedToken = token.replace('Bearer ', '');
    }
    try {
      const { exp, iat, ...data } = jwt.verify(cleanedToken, secret);
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  return {
    sign,
    verify,
  };
};
module.exports = JwtSigner;
