const User = require('../models/user');

function handleErrs(err, res) {
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'NotValid Data' });
  }
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).send({ message: 'User not found' });
  }
  return res
    .status(500)
    .send({ message: 'An error has occurred on the server' });
}

// get all users
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => handleErrs(err, res));
};

// get an user based on the id
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      const { users } = data;
      if (!users.find((user) => user._id === req.params.id)) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.send(users.find((user) => user._id === req.params.id));
      }
    })
    .catch((err) => handleErrs(err, res));
};

// add a new user
module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'User validation failed' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

// update profile
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => handleErrs(err, res));
};

// update avatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => handleErrs(err, res));
};
