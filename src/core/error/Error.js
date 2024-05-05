class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

class PostNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PostNotFoundError';
  }
}

class InvalidUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidUserError';
  }
}

class InvalidPostError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidPostError';
  }
}

module.exports = {
  UserNotFoundError,
  InvalidUserError,
  PostNotFoundError,
  InvalidPostError,
};
