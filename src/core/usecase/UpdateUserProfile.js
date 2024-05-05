const User = require('../entity/User');
const { UserNotFoundError } = require('../error/Error');

const UpdateUserProfile = (userRepository, cypher) => {
  const execute = async (requesterId, userInfo) => {
    try {
      const { email, name, password } = userInfo;

      const newUser = User({
        id: '0',
        name,
        email,
        password,
      });

      const user = await userRepository.findByEmail(email);

      if (user) {
        if (user && user.id !== requesterId) {
          throw new Error('You are not allowed to update this user');
        }
        newUser.id = user.id;
        newUser.password = await cypher.encrypt(password);
        return await userRepository.create(newUser);
      }
      throw new UserNotFoundError('User not found');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return {
    execute,
  };
};
module.exports = UpdateUserProfile;
