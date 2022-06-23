/* eslint-disable */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const { errors } = require("celebrate");

const auth = require("./middleware/auth");
const { addUser, login } = require("./controllers/users");

// const cardsPath = path.join(__dirname, '/routes/cards.js');
// const usersPath = path.join(__dirname, '/routes/users.js');

const cardsRouter = require(path.join(__dirname, "/routes/cards.js"));
const usersRouter = require(path.join(__dirname, "/routes/users.js"));

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(helmet());

app.use(errors());

app.use("/", auth, usersRouter);
app.use("/", auth, cardsRouter);

// signin
app.post("/signin", login);
// sigup
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  addUser
);

app.use("/", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
