const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const NotFoundError = require("../errors/NotFoundError");
const AuthError = require("../errors/AuthError");
const BadRequestError = require("../errors/BadRequestError");

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

// get all users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

// get an user based on the id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((data) => {
      const { users } = data;
      if (!users.find((user) => user._id === req.params.id)) {
        throw new NotFoundError("User not found");
      } else {
        res.send(users.find((user) => user._id === req.params.id));
      }
    })
    .catch(next);
};

// add a new user
module.exports.addUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash }))
    .then((user) => {
      if (!user) {
        throw new AuthError("cannot create the user please try again");
      }
      res.send({ data: user });
    })
    .catch(next);
};

// update profile
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true }
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError("cannot update profile, please try again");
      }
      res.send({ data: user });
    })
    .catch(next);
};

// update avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true }
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError(
          "cannot update avatar, please try again later"
        );
      }
      res.send({ data: user });
    })
    .catch(next);
};

// login contoller
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError("Incorrect email or password");
      } else {
        req._id = user._id;
        return bcrypt.compare(password, user.password);
      }
    })
    .then((matched) => {
      if (!matched) {
        throw new AuthError("Incorrect email or password");
      } else {
        const token = jwt.sign(
          { _id: req._id },
          NODE_ENV === "production" ? JWT_SECRET : "super-secret",
          { expiresIn: "7d" }
        );
        res.send({ token });
      }
    })
    .catch(next);
};

// get my user
module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      const { users } = data;
      if (!users.find((user) => user._id === req.user._id)) {
        throw new NotFoundError("cannot find user");
      } else {
        res.send(users.find((user) => user));
      }
    })
    .catch(next);
};
