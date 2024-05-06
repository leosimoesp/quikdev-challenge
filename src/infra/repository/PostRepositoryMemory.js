const Post = require('../../core/entity/Post');
const { PostNotFoundError } = require('../../core/error/Error');

const PostRepositoryMemory = () => {
  const create = async ({ userId, title, description, image }) => {};

  const findById = async (postId) => {};

  const updateWithHistory = async (oldPost, newPost) => {};

  return {
    create,
    findById,
    updateWithHistory,
  };
};

module.exports = {
  PostRepositoryMemory,
};
