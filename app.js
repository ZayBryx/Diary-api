require("express-async-errors");

const express = require("express");
const app = express();

const port = process.env.PORT;
const db_uri = process.env.DB_URI;

const connectDB = require("./db/connect");
const authUser = require("./middleware/authentication");

app.use(express.json());
app.use(express.static("./public"));

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routes
const authRouter = require("./routes/auth");
const diaryRouter = require("./routes/Diary");

app.get("/", (req, res) => {
  res.send("Diary API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/diary", authUser, diaryRouter);

//middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async (req, res) => {
  await connectDB(db_uri);
  app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}/`);
  });
};

start();
