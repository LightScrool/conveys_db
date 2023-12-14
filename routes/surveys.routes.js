const Router = require("express");

const ApiError = require("../error/api-error");
const surveyEntity = require("../entities/survey.entity");
const questionEntity = require("../entities/question.entity");
const responseEntity = require("../entities/response.entity");

const router = new Router();

router.post("/", async (req, res, next) => {
  try {
    if (!req.auth?.status) {
      throw ApiError.unauthorized();
    }

    const user_id = req.auth.user.id;
    const { title, description, questions } = req.body;

    if (!title || !questions) {
      throw ApiError.badRequest("title or questions was not provided");
    }

    const newSurvey = await surveyEntity.create({
      user_id,
      title,
      description,
      questions,
    });

    res.json(newSurvey);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    res.json(await surveyEntity.getAll());
  } catch (error) {
    return next(error);
  }
});

router.get("/:surveyId", async (req, res, next) => {
  try {
    const surveyId = req.params.surveyId;
    const userId = req.auth?.user?.id ?? null;
    const survey = await surveyEntity.getById(surveyId, userId);

    if (!survey) {
      throw ApiError.notFound("Survey doesn't exists");
    }

    res.json(survey);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:surveyId/close", async (req, res, next) => {
  try {
    if (!req.auth?.status) {
      throw ApiError.unauthorized();
    }

    const surveyId = req.params.surveyId;
    const survey = await surveyEntity.getById(surveyId);

    if (!survey) {
      throw ApiError.notFound("Survey doesn't exists");
    }

    if (survey.user_id !== req.auth.user.id) {
      throw ApiError.forbidden();
    }

    await surveyEntity.close(surveyId);

    res.json({ message: "OK" });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:surveyId/open", async (req, res, next) => {
  try {
    if (!req.auth?.status) {
      throw ApiError.unauthorized();
    }

    const surveyId = req.params.surveyId;
    const survey = await surveyEntity.getById(surveyId);

    if (!survey) {
      throw ApiError.notFound("Survey doesn't exists");
    }

    if (survey.user_id !== req.auth.user.id) {
      throw ApiError.forbidden();
    }

    await surveyEntity.open(surveyId);

    res.json({ message: "OK" });
  } catch (error) {
    return next(error);
  }
});

router.post("/:surveyId/response", async (req, res, next) => {
  try {
    if (!req.auth?.status) {
      throw ApiError.unauthorized();
    }

    const answers = req.body;
    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      throw ApiError.badRequest();
    }

    const survey_id = req.params.surveyId;
    const survey = await surveyEntity.getById(survey_id);

    if (!survey) {
      throw ApiError.notFound("Survey doesn't exists!");
    }

    const user_id = req.auth.user.id;
    if (survey.user_id === user_id) {
      throw ApiError.badRequest("You can not response to your own surveys!");
    }

    const didUserResponseSurvey =
      await responseEntity.checkDidUserResponseSurvey({ survey_id, user_id });
    if (didUserResponseSurvey) {
      throw ApiError.badRequest("You have already response to this survey!");
    }

    const questions = await questionEntity.getAllOfSurvey(survey_id);
    for (let question of questions) {
      if (question.is_necessary && !answers[String(question.id)]) {
        throw ApiError.badRequest(
          "Some of necessary questions was not answered!",
        );
      }
    }

    const questionsIdsSet = new Set(questions.map(({ id }) => String(id)));
    for (let questionId of Object.keys(answers)) {
      if (!questionsIdsSet.has(questionId)) {
        throw ApiError.badRequest(
          "You attempted to answer question not from the survey!",
        );
      }
    }

    await responseEntity.create({ user_id, survey_id, answers });

    res.json({ message: "OK" });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:surveyId", async (req, res, next) => {
  try {
    if (!req.auth?.status) {
      throw ApiError.unauthorized();
    }

    const surveyId = req.params.surveyId;
    const survey = await surveyEntity.getById(surveyId);

    if (!survey) {
      throw ApiError.notFound("Survey doesn't exists");
    }

    if (survey.user_id !== req.auth.user.id) {
      throw ApiError.forbidden();
    }

    await surveyEntity.remove(surveyId);

    res.json({ message: "OK" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
