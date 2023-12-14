const Router = require("express");

const healthCheckRouter = require("./health-check");
const surveysRouter = require("./surveys.routes");

const router = new Router();

router.use("/health-check", healthCheckRouter);
router.use("/surveys", surveysRouter);

module.exports = router;
