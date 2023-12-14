const db = require("../db");
const answerEntity = require("./answer.entity");

class ResponseEntity {
  async checkDidUserResponseSurvey({ survey_id, user_id }) {
    const queryResult = await db.query(
      "SELECT COUNT(*) FROM responses WHERE survey_id = $1 AND user_id = $2",
      [survey_id, user_id],
    );

    return Boolean(Number(queryResult.rows[0]?.count));
  }

  async create({ user_id, survey_id, answers }) {
    const response_id = (
      await db.query(
        "INSERT INTO responses (user_id, survey_id) VALUES ($1, $2) RETURNING id",
        [user_id, survey_id],
      )
    ).rows[0].id;

    await Promise.all(
      Object.entries(answers).map(([key, value]) => {
        const question_id = Number(key);
        return answerEntity.create({ question_id, response_id, value });
      }),
    );
  }
}

module.exports = new ResponseEntity();
