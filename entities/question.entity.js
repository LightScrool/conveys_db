const db = require("../db");

class QuestionEntity {
  async create({ surveyId, text, is_necessary = true }) {
    const queryResult = await db.query(
      "INSERT INTO questions (survey_id, text, is_necessary) values ($1, $2, $3) RETURNING *",
      [surveyId, text, is_necessary],
    );

    return queryResult.rows[0] ?? null;
  }

  async getAllOfSurvey(surveyId) {
    const queryResult = await db.query(
      "SELECT id, text, is_necessary FROM questions WHERE survey_id = $1",
      [surveyId],
    );
    return queryResult.rows ?? [];
  }
}

module.exports = new QuestionEntity();
