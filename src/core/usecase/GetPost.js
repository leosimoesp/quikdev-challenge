const GetPost = (postRepository) => {
  const execute = async (postId) => {
    try {
      const post = await postRepository.getPostById(postId);
      if (post) {
        await postRepository.registerPostVisualization(post.id);
        return post;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return {
    execute,
  };
};
module.exports = GetPost;
