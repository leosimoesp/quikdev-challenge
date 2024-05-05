class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

class InvalidUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidUserError';
  }
}

module.exports = {
  UserNotFoundError,
  InvalidUserError,
};
