const User = require('../../core/entity/User');
const crypto = require('crypto');

const UserRepositoryMemory = () => {
  const users = [];

  const create = async ({ name, email, password }) => {
    const id = crypto.randomBytes(24).toString('hex');
    try {
      const userExists = users.find((user) => user.email === email);
      if (userExists) {
        throw new Error('User already exists');
      }

      const user = User({ id, name, email, password });
      users.push(user);
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const findByEmail = async (email) => {
    const user = users.find((user) => user.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  };

  const createHistoryLogin = async (userId) => {};

  return {
    create,
    findByEmail,
    createHistoryLogin,
  };
};

module.exports = {
  UserRepositoryMemory,
};
