const { PostRepositorySQL } = require('../infra/repository/PostRepositorySQL');
const CreatePost = require('../core/usecase/CreatePost');

const PostController = () => {
  const createPost = async (req, res, next) => {
    try {
      const postRepositorySQL = PostRepositorySQL();
      const createPost = CreatePost(postRepositorySQL);
      const title = req.body.title;
      const description = req.body.description;
      const image = req.body.image;
      const { user: userId } = req.userInfo;
      const post = await createPost.execute(userId, {
        title,
        description,
        image,
      });
      if (post) {
        res.status(200).json({ message: 'New post created' });
      }
    } catch (err) {
      next(err);
    }
  };
  return {
    createPost,
  };
};
module.exports = PostController;
