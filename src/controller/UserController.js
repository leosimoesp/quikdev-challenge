const { UserRepositorySQL } = require('../infra/repository/UserRepositorySQL');
const UpdateUserProfile = require('../core/usecase/UpdateUserProfile');
const BcryptCipher = require('../infra/security/BcryptCipher');

const UserController = () => {
  const updateProfile = async (req, res, next) => {
    try {
      const cypher = BcryptCipher();
      const userRepositorySQL = UserRepositorySQL();
      const updateUserProfile = UpdateUserProfile(userRepositorySQL, cypher);
      const email = req.body.email;
      const name = req.body.name;
      const password = req.body.password;
      const { user: userId } = req.userInfo;

      const updatedUser = await updateUserProfile.execute(userId, {
        email,
        name,
        password,
      });

      if (updatedUser) {
        res.status(200).json({ message: 'User updated successfully' });
      }
    } catch (err) {
      next(err);
    }
  };

  return {
    updateProfile,
  };
};

module.exports = UserController;
