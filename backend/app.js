/* eslint-disable */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const validator = require("validator");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const auth = require("./middlewares/auth");
const { addUser, login } = require("./controllers/users");
const { celebrate, Joi, errors } = require("celebrate");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const cardsRouter = require(path.join(__dirname, "/routes/cards.js"));
const usersRouter = require(path.join(__dirname, "/routes/users.js"));

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(helmet());

app.use(requestLogger);

app.use("/", auth, usersRouter);
app.use("/", auth, cardsRouter);

// signin
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
// sigup
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().required().custom(validateURL),
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  addUser
);

app.use(errorLogger);

app.use(errors());

app.use("/", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
