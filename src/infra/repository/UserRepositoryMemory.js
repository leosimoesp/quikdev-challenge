const User = require('../../core/entity/User');
const crypto = require('crypto');
const { UserNotFoundError } = require('../../core/error/Error');

const UserRepositoryMemory = () => {
  const users = [];

  const create = async ({ name, email, password }) => {
    const id = crypto.randomBytes(24).toString('hex');
    try {
      const userExists = users.find((user) => user.email === email);
      if (userExists) {
        return User({
          id: userExists.id,
          name,
          email: userExists.email,
          password,
        });
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
      throw new UserNotFoundError('User not found');
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
