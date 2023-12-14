const Router = require("express");

const ApiError = require("../error/api-error");

const router = new Router();

router.get("/ping", (req, res, next) => {
  try {
    res.status(200).json({ message: "pong" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
