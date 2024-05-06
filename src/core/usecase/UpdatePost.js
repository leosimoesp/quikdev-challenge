const { PostNotFoundError, NotAuthorizedError } = require('../error/Error');
const UpdatePost = (postRepository, fileUploadProvider) => {
  const execute = async (requesterId, postInfo, file) => {
    try {
      const { id, title, description, image } = postInfo;

      const post = await postRepository.findById(id);

      if (post) {
        if (post.userId !== requesterId) {
          throw new NotAuthorizedError('You are not allowed to edit this post');
        }
        const newPost = { id, userId: post.userId };
        newPost.title = title ? title : post.title;
        newPost.description = description ? description : post.description;
        if (file) {
          const { url } = await fileUploadProvider.uploadFile(file);
          newPost.image = url;
        }
        return await postRepository.updateWithHistory(post, newPost);
      }

      throw new PostNotFoundError('Post not found');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return {
    execute,
  };
};
module.exports = UpdatePost;
