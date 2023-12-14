const db = require("../db");
const questionEntity = require("./question.entity");
const answerEntity = require("./answer.entity");

class SurveyEntity {
  async create({
    user_id,
    title,
    description = "",
    is_open = true,
    questions = [],
  }) {
    const createQueryResult = await db.query(
      "INSERT INTO surveys (user_id, title, description, is_open) values ($1, $2, $3, $4) RETURNING *",
      [user_id, title, description, is_open],
    );
    const newSurveyId = createQueryResult.rows[0]?.id;

    await Promise.all(
      questions.map((question) =>
        questionEntity.create({
          surveyId: newSurveyId,
          text: question.text,
          is_necessary: question.is_necessary,
        }),
      ),
    );

    return await this.getById(newSurveyId);
  }

  async getById(surveyId, userId) {
    const survey = (
      await db.query("SELECT * FROM surveys WHERE id = $1", [surveyId])
    ).rows[0];

    if (!survey) {
      return survey;
    }

    survey.questions = await questionEntity.getAllOfSurvey(surveyId);

    const owner = survey.user_id;
    if (owner === userId) {
      await Promise.all(
        survey.questions.map((question) =>
          answerEntity.getAllOfQuestion(question.id).then((answers) => {
            question.answers = answers;
          }),
        ),
      );
    }

    return survey;
  }

  async getAll() {
    const queryResult = await db.query("SELECT * FROM surveys");
    return queryResult.rows;
  }

  async close(id) {
    const queryResult = await db.query(
      "UPDATE surveys SET is_open = false WHERE id = $1",
      [id],
    );
    return queryResult.rows[0] ?? null;
  }

  async open(id) {
    const queryResult = await db.query(
      "UPDATE surveys SET is_open = true WHERE id = $1",
      [id],
    );
    return queryResult.rows[0] ?? null;
  }

  async remove(id) {
    await db.query("DELETE FROM surveys WHERE id = $1", [id]);
  }
}

module.exports = new SurveyEntity();
