const AuthenticateUser = (userRepository, cypher) => {
  const execute = async (email, password) => {
    try {
      const user = await userRepository.findByEmail(email);

      if (user) {
        const isAuthenticated = await cypher.compare(password, user.password);

        if (isAuthenticated) {
          await userRepository.createHistoryLogin(user.id);
          return {
            authenticated: isAuthenticated,
            userId: user.id,
          };
        }
      }
      return {
        authenticated: false,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return {
    execute,
  };
};

module.exports = AuthenticateUser;
