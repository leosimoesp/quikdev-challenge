const AuthenticateController = () => {
  const authenticate = (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
  };

  return {
    authenticate,
  };
};

module.exports = AuthenticateController;
