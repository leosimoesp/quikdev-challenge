const Post = require('../../core/entity/Post');
const { getDBPool } = require('../db/pgsql/manager/config');
const { PostNotFoundError } = require('../../core/error/Error');

const PostRepositorySQL = () => {
  const create = async ({ userId, title, description, image }) => {
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'create-post',
      text: `INSERT into post(user_id, title, description, image) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT(id) 
      DO NOTHING 
      RETURNING id;`,
      values: [userId, title, description, image],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return Post({
          id: rows[0].id,
          userId,
          title,
          description,
          image,
        });
      }
      return null;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
      await dbPool.end();
    }
  };

  const findById = async (postId) => {
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'find-post-by-id',
      text: `SELECT p.id, p.title, p.description, p.image FROM post p WHERE p.id=$1;`,
      values: [postId],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return Post({
          id: rows[0].id,
          title: rows[0].title,
          description: rows[0].description,
          image: rows[0].image,
        });
      }
      throw new PostNotFoundError('Post not found');
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
      await dbPool.end();
    }
  };

  return {
    create,
    findById,
  };
};

module.exports = {
  PostRepositorySQL,
};
