const { InvalidPostError } = require('../error/Error');

const Post = ({ id, userId, title, description, image }) => {
  let _userId;
  let _title;
  let _description;
  let _id;
  let _image;

  _userId = userId;
  _title = title;
  _description = description;
  _id = id;
  _image = image;

  const isValid = () => {
    if (!id) {
      throw new InvalidPostError('Id can not be null');
    }
    if (!userId) {
      throw new InvalidPostError('User id can not be null');
    }
    if (!title) {
      throw new InvalidPostError('Title can not be null');
    }
    if (!description) {
      throw new InvalidPostError('Description can not be null');
    }

    return true;
  };
  isValid();

  return {
    id,
    userId,
    title,
    description,
    isValid,
  };
};
module.exports = Post;
