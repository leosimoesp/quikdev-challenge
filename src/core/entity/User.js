const { InvalidUserError } = require('../error/Error');

const User = ({ id, name, email, password }) => {
  let _name;
  let _email;
  let _password;
  let _id;

  _name = name;
  _email = email;
  _password = password;
  _id = id;

  const isValid = () => {
    if (!id) {
      throw new InvalidUserError('Id can not be null');
    }
    if (!name) {
      throw new InvalidUserError('Name can not be null');
    }
    if (!email) {
      throw new InvalidUserError('E-mail can not be null');
    }
    if (!password) {
      throw new InvalidUserError('Password can not be null');
    }

    //@TODO add others validation. Sample email valid, password requirements, etc...
    return true;
  };
  isValid();

  return {
    id,
    name,
    email,
    password,
    isValid,
  };
};
module.exports = User;
