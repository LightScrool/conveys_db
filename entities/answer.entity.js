const db = require("../db");

class AnswerEntity {
    async create({question_id, response_id, value}) {
        const queryResult = await db.query(
            "INSERT INTO answers (question_id, response_id, value) VALUES ($1, $2, $3) RETURNING *",
            [question_id, response_id, value],
        );
        return queryResult.rows[0] ?? null;
    }

    async getAllOfQuestion(questionId) {
        const queryResult = await db.query(
            "SELECT id, value FROM answers WHERE question_id = $1",
            [questionId],
        );
        return queryResult.rows ?? [];
    }
}

module.exports = new AnswerEntity();
