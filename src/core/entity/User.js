const User = ({ id, name, email, password }) => {
  let _name;
  let _email;
  let _password;
  let _id;

  _name = name;
  _email = email;
  _password = password;
  _id = id;

  const comparePassword = (password) => {
    return _password === password;
  };

  const isValid = () => {
    if (!_id || !_name || !_email || !_password) {
      throw Error("Invalid User");
    }
    return true;
  };
  isValid();

  return {
    id,
    name,
    email,
    password,
    isValid,
    comparePassword,
  };
};
module.exports = User;
