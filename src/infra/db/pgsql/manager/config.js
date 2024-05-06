const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

let isDBSync = false;
const config = {
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  max: process.env.DATABASE_MAX_CLIENTS,
  idleTimeoutMillis: process.env.DATABASE_IDLE_TIMEOUTMILIS,
  timezone: process.env.DATABASE_TIMEZONE,
};

function getNewPool() {
  return new Pool(config);
}

async function executeQuery(queryConfig) {
  const pool = getNewPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(queryConfig);
    const res = await client.query('COMMIT');
    if (res) {
      return true;
    }
    return false;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.end();
  }
}

async function existVersion(version) {
  const sql = {
    name: 'fetch-version',
    text: 'SELECT * FROM db_migration WHERE version=$1',
    values: [version],
  };
  const pool = getNewPool();
  const client = await pool.connect();
  let res;
  try {
    res = await client.query(sql);
    if (res && res.rows.length > 0) {
      return true;
    }
    return false;
  } finally {
    client.end();
  }
}

async function createDB() {
  const pool = getNewPool();
  const client = await pool.connect();
  const sql = fs
    .readFileSync(path.resolve('src/infra/db/pgsql/manager', 'setup.sql'))
    .toString();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    const res = await client.query('COMMIT');
    if (res) {
      //@TODO add custom log
    }
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.end();
  }
  return true;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

async function executeSQL(dir, version) {
  const readSQL = fs.readFileSync(path.resolve(dir, version)).toString();
  const res = await executeQuery(readSQL);

  if (res) {
    //@TODO add custom log
    return true;
  }
  return false;
}

async function saveVersion(version, status) {
  const sql = {
    name: 'insert-version',
    text: 'INSERT INTO db_migration(version, status) VALUES($1, $2) RETURNING *',
    values: [version, status],
  };
  const res = await executeQuery(sql);
  if (res) {
    return version;
  }
  throw new Error(`Error when saving ${version}`);
}

async function syncVersions() {
  await asyncForEach(
    fs.readdirSync(path.resolve('src/infra/db/pgsql/migrations')),
    async (file) => {
      const fileExist = await existVersion(file);
      let execSql = false;
      if (!fileExist) {
        execSql = await executeSQL('src/infra/db/pgsql/migrations', file);
      }
      if (execSql) {
        saveVersion(file, 'success');
        //@TODO add custom log
      }
    }
  );
}

async function start() {
  const created = await createDB();
  if (created) {
    await syncVersions();
  }
}

async function validateEnvVars() {
  if (
    !config.user ||
    !config.host ||
    !config.password ||
    !config.database ||
    !config.port ||
    !config.max ||
    !config.idleTimeoutMillis ||
    !config.timezone
  ) {
    throw new Error(
      'You must set env vars: PGUSER | PGHOST | PGPASSWORD | PGDATABASE | PGPORT | PGMAXCLIENTS | PGIDLETIMEOUTMILIS | PGTIMEZONE'
    );
  }

  await start();
  isDBSync = true;
}

module.exports = {
  syncDB: function syncDBWrapper() {
    return validateEnvVars();
  },
  getDBPool: function getDBPoolWrapper() {
    return getNewPool();
  },
};
