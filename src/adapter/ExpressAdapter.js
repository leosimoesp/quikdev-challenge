const ExpressAdapter = (jwtSigner, envLoader) => {
  const create = (fn) => {
    return async function (req, res, next) {
      const obj = await fn(req.params, req.body);
      res.json(obj);
    };
  };

  const validateTokenJWT = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      res.status(401).end();
      return;
    }
    try {
      const data = await jwtSigner.verify(
        token,
        envLoader.getEnv('SECRET_KEY')
      );
      if (data) {
        req.userInfo = data;
        next();
      } else {
        res.status(403).end();
      }
    } catch (err) {
      res.status(403).end();
    }
  };

  return {
    create,
    validateTokenJWT,
  };
};

module.exports = ExpressAdapter;
