const db = require("../db");

class UserEntity {
  async getByPuid(puid) {
    const queryResult = await db.query(
      "SELECT * FROM users  WHERE yandex_puid = $1",
      [puid],
    );

    return queryResult.rows[0] ?? null;
  }

  async create({ puid, score = 0 }) {
    const queryResult = await db.query(
      "INSERT INTO users (yandex_puid, score) values ($1, $2) RETURNING *",
      [puid, score],
    );

    return queryResult.rows[0] ?? null;
  }
}

module.exports = new UserEntity();
