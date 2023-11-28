require("express-async-errors");

const express = require("express");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");

const app = express();
const port = process.env.PORT;
const db_uri = process.env.DB_URI;

const connectDB = require("./db/connect");
const authUser = require("./middleware/authentication");

app.use(express.json());
app.use(express.static("./public"));

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
);
app.use(cors());
app.use(xss());
app.use(helmet());

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routes
const authRouter = require("./routes/auth");
const diaryRouter = require("./routes/Diary");
const settingRoute = require("./routes/settings");

app.get("/", (req, res) => {
  res.send("Diary API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/diary", authUser, diaryRouter);
app.use("/api/v1/settings", authUser, settingRoute);

//middlewares
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const start = async (req, res) => {
  await connectDB(db_uri);
  app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}/`);
  });
};

start();
