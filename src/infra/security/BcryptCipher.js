const bcrypt = require('bcrypt');
const saltRounds = 10;

const BcryptCipher = () => {
  const encrypt = async (value) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  };

  const compare = async (value, hash) => {
    const isMatch = await bcrypt.compare(value, hash);
    return isMatch;
  };

  return {
    encrypt,
    compare,
  };
};
module.exports = BcryptCipher;
