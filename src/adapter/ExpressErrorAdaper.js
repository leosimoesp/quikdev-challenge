const { UserNotFoundError, InvalidUserError } = require('../core/error/Error');

const ExpressErrorAdapter = (err, req, res, next) => {
  console.error(err.stack);

  switch (err.constructor) {
    case UserNotFoundError:
      return res.status(404).json({
        error: err.message,
      });
    case InvalidUserError:
      return res.status(422).json({
        error: err.message,
      });
    default:
      return res.status(500).json({
        error: 'Internal Server Error',
      });
  }
};
module.exports = ExpressErrorAdapter;
