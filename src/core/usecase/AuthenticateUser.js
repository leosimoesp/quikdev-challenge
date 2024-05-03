const AuthenticateUser = (userRepository) => {
  const execute = async (email, password) => {
    try {
      const user = await userRepository.findByEmail(email);
      if (user && user.password === password) {
        return true;
      }
      return false;
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
