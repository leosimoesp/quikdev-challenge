const { UserRepositorySQL } = require('../infra/repository/UserRepositorySQL');
const UpdateUserProfile = require('../core/usecase/UpdateUserProfile');
const BcryptCipher = require('../infra/security/BcryptCipher');

const UpdateUserProfileController = (jwtSigner, envLoader) => {
  const updateProfile = async (req, res, next) => {
    try {
      const cypher = BcryptCipher();
      const userRepositorySQL = UserRepositorySQL();
      const updateUserProfile = UpdateUserProfile(userRepositorySQL, cypher);
      const email = req.body.email;
      const name = req.body.name;
      const password = req.body.password;

      const token = req.headers['authorization'];

      const { user: userId } = await jwtSigner.verify(
        token,
        envLoader.getEnv('SECRET_KEY')
      );

      const updatedUser = await updateUserProfile.execute(userId, {
        email,
        name,
        password,
      });

      if (updatedUser) {
        res.status(201).json({ message: 'User updated successfully' });
      }
    } catch (err) {
      next(err);
    }
  };

  return {
    updateProfile,
  };
};

module.exports = UpdateUserProfileController;
