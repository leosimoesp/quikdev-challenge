const AuthenticateUser = require('../core/usecase/AuthenticateUser');
const { UserRepositorySQL } = require('../infra/repository/UserRepositorySQL');
const BcryptCipher = require('../infra/security/BcryptCipher');

const AuthenticateController = (jwtSigner, envLoader) => {
  const authenticate = async (req, res) => {
    try {
      const userRepositorySQL = UserRepositorySQL();
      const cypher = BcryptCipher();
      const authenticateUser = AuthenticateUser(userRepositorySQL, cypher);
      const email = req.body.email;
      const password = req.body.password;
      const { authenticated, userId } = await authenticateUser.execute(
        email,
        password
      );

      if (authenticated) {
        const token = await jwtSigner.sign(
          { user: userId },
          envLoader.getEnv('SECRET_KEY'),
          envLoader.getEnv('JWT_EXPIRES_IN_MIN')
        );
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

  return {
    authenticate,
  };
};

module.exports = AuthenticateController;
