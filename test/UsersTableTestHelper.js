/* istanbul ignore file */
const pool = require('../src/Infrastuctures/database/postgres/pool')

const UsersTableTestHelper = {
  async addUser({
    id = '38f33a33-19df-4015-be12-ac49b060f8e4',
    username = 'yogi',
    password = 'password',
    fullname = 'Yogi Pristiawan',
  }) {
    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    }

    await pool.query(query)
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users')
  },
}

module.exports = UsersTableTestHelper
