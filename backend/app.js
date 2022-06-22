/* eslint-disable */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");

// const cardsPath = path.join(__dirname, '/routes/cards.js');
// const usersPath = path.join(__dirname, '/routes/users.js');

const cardsRouter = require(path.join(__dirname, "/routes/cards.js"));
const usersRouter = require(path.join(__dirname, "/routes/users.js"));

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(helmet());

// a temporary solution to add an owner to each card
app.use((req, res, next) => {
  req.user = {
    _id: "6290e73ac12beb7de1c8db27",
  };

  next();
});

app.use("/", usersRouter);
app.use("/", cardsRouter);

app.use("/", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
