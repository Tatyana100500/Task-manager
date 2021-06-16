// @ts-check

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const { env } = process;

module.exports = () => ({
  production: {
    client: env.PROD_DB_TYPE,
    connection: {
      user: env.PROD_DB_USER,
      password: env.PROD_DB_PASSWORD,
      database: env.PROD_DB_NAME,
      host: env.PROD_DB_HOST,
      port: env.PROD_DB_PORT,
      database_url: env.PROD_DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    useNullAsDefault: true,
    migrations,
  },
  development: {
    client: env.DEV_DB_TYPE,
    connection: {
      user: env.DEV_DB_USER,
      password: env.DEV_DB_PASSWORD,
      database: env.DEV_DB_NAME,
      host: env.DEV_DB_HOST,
      port: env.DEV_DB_PORT,
    },
    useNullAsDefault: true,
    migrations,
  },
  test: {
    client: env.TEST_DB_TYPE,
    connection: {
      filename: env.TEST_DB,
    },
    useNullAsDefault: true,
    migrations,
  },
});