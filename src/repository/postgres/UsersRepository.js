const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class UsersRepository {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    id, username, hashedPassword, fullname,
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    console.log(result);
    if (result.rowCount === 0) {
      throw new InvariantError('Failed insert data to table users');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    console.log(result);
    if (result.rowCount > 0) {
      throw new InvariantError('Failed user registration. Username already in use.');
    }
  }
}

module.exports = UsersRepository;
