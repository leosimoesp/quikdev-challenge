const GetAllPosts = (postRepository) => {
  const execute = async () => {
    try {
      return await postRepository.getAllPosts();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return {
    execute,
  };
};
module.exports = GetAllPosts;
