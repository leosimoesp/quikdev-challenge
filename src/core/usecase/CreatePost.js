const Post = require('../../core/entity/Post');
const CreatePost = (postRepository) => {
  const execute = async (requesterId, postInfo) => {
    try {
      const { title, description, image } = postInfo;
      const post = Post({
        id: '0',
        userId: requesterId,
        title,
        description,
        image,
      });
      return await postRepository.create(post);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return {
    execute,
  };
};
module.exports = CreatePost;
