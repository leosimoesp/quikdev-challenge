const User = require('../../core/entity/User');
const { getDBPool } = require('../db/pgsql/manager/config');
const { UserNotFoundError } = require('../../core/error/Error');

const UserRepositorySQL = () => {
  const create = async ({ name, email, password }) => {
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'create-user',
      text: `INSERT into "user"(name, email, password) 
      VALUES($1, $2, $3) 
      ON CONFLICT(email) 
      DO UPDATE 
        SET name = excluded.name, password = excluded.password, updated_at=now()
      RETURNING id;`,
      values: [name, email, password],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return User({ id: rows[0].id, name, email, password });
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

  const findByEmail = async (email) => {
    const emailLowerCase = email ? email.toLowerCase() : '';
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'find-user-by-email',
      text: `SELECT u.id, u.email, u.password, u.name FROM "user" u WHERE LOWER(u.email)=$1;`,
      values: [emailLowerCase],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return User({
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          password: rows[0].password,
        });
      }
      throw new UserNotFoundError('User not found');
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
      await dbPool.end();
    }
  };

  const createHistoryLogin = async (userId) => {
    const dbPool = await getDBPool();
    const client = await dbPool.connect();
    const sql = {
      name: 'create-history-login',
      text: `INSERT INTO login_history(user_id) VALUES($1) RETURNING id;`,
      values: [userId],
    };
    try {
      const { rows } = await client.query(sql);
      if (rows && rows.length > 0) {
        return;
      } else {
        throw new Error('Error create history login');
      }
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
    findByEmail,
    createHistoryLogin,
  };
};

module.exports = {
  UserRepositorySQL,
};
