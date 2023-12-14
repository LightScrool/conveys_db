const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const router = require("./routes/index");
const errorHandlingMiddleware = require("./middleware/error-handling-middleware");
const authMiddleware = require("./middleware/auth-middleware");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/api", router);

app.use(errorHandlingMiddleware); // Must be the last one

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

start();
