const { PostRepositorySQL } = require('../infra/repository/PostRepositorySQL');
const CreatePost = require('../core/usecase/CreatePost');
const UpdatePost = require('../core/usecase/UpdatePost');
const GetAllPosts = require('../core/usecase/GetAllPosts');
const GetPost = require('../core/usecase/GetPost');

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

  const updatePost = async (req, res, next) => {
    try {
      const postRepositorySQL = PostRepositorySQL();
      const updatePost = UpdatePost(postRepositorySQL);
      const title = req.body.title;
      const description = req.body.description;
      const image = req.body.image;
      const { user: userId } = req.userInfo;
      const id = req.params.id;

      const post = await updatePost.execute(userId, {
        id,
        title,
        description,
        image,
      });
      if (post) {
        res.status(200).json({ message: 'Post updated' });
      }
    } catch (err) {
      next(err);
    }
  };

  const getAllPosts = async (req, res, next) => {
    try {
      const postRepositorySQL = PostRepositorySQL();
      const getAllPosts = GetAllPosts(postRepositorySQL);

      const posts = await getAllPosts.execute();
      if (posts) {
        res.status(200).json(posts);
      }
    } catch (err) {
      next(err);
    }
  };

  const getPost = async (req, res, next) => {
    try {
      const postRepositorySQL = PostRepositorySQL();
      const getPost = GetPost(postRepositorySQL);

      const id = req.params.id;

      const post = await getPost.execute(id);
      if (post) {
        res.status(200).json(post);
      }
    } catch (err) {
      next(err);
    }
  };

  return {
    createPost,
    updatePost,
    getAllPosts,
    getPost,
  };
};
module.exports = PostController;
