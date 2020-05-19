module.exports = {
  development: {
    username: 'postgres',
    password: 'ebom',
    database: 'postgres',
    host: 'db',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: 'postgres',
    password: 'ebom',
    database: 'postgres',
    host: 'db',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'ec2-52-202-22-140.compute-1.amazonaws.com',
    dialect: 'postgres'
  }
}
