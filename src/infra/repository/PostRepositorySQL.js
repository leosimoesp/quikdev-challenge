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
      text: `SELECT p.id, p.user_id, p.title, p.description, p.image FROM post p WHERE p.id=$1;`,
      values: [postId],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return Post({
          id: rows[0].id,
          userId: rows[0].user_id,
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

  const updateWithHistory = async (oldPost, newPost) => {
    const {
      id,
      userId,
      title: oldTitle,
      description: oldDesc,
      image: oldImg,
    } = oldPost;

    const { title: newTitle, description: newDesc, image: newImg } = newPost;

    const sqlInsert = {
      name: 'insert-post-history',
      text: `INSERT INTO post_history(post_id, user_id, title, description, image) VALUES ($1, $2, $3, $4, $5);`,
      values: [id, userId, oldTitle, oldDesc, oldImg],
    };
    const sqlUpdate = {
      name: 'update-post',
      text: `UPDATE post p SET title=$2, description=$3, image=$4, updated_at=now()
      WHERE p.id=$1
      RETURNING id;`,
      values: [id, newTitle, newDesc, newImg],
    };

    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(sqlUpdate);
      await client.query(sqlInsert);
      if (rows && rows.length > 0) {
        await client.query('COMMIT');
        return Post({
          id,
          userId,
          title: newTitle,
          description: newDesc,
          image: newImg,
        });
      }
      return null;
    } catch (err) {
      console.error(err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
      await dbPool.end();
    }
  };

  const getAllPosts = async () => {
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'get-all-posts',
      text: `SELECT p.id, p.user_id, p.title, p.description, p.image FROM post p ORDER BY p.created_at DESC;`,
      values: [],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return rows.map((post) =>
          Post({
            id: post.id,
            userId: post.user_id,
            title: post.title,
            description: post.description,
            image: post.image,
          })
        );
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

  const getPostById = async (postId) => {
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'get-posts-by-id',
      text: `SELECT p.id, p.user_id, p.title, p.description, p.image FROM post p WHERE p.id=$1;`,
      values: [postId],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return Post({
          id: rows[0].id,
          userId: rows[0].user_id,
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

  const registerPostVisualization = async (postId) => {
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'register-post-visualization',
      text: `INSERT INTO post_views(post_id,created_at) VALUES ($1, now())
      ON CONFLICT(post_id)
      DO UPDATE
      SET updated_at=now(), total_of_visualizations=post_views.total_of_visualizations + 1 RETURNING post_id;`,
      values: [postId],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return;
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
    updateWithHistory,
    getAllPosts,
    getPostById,
    registerPostVisualization,
  };
};

module.exports = {
  PostRepositorySQL,
};
