const Card = require('../models/card');

function handleErrs(err, res) {
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'NotValid Data' });
  }
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).send({ message: 'Card not found' });
  }
  return res
    .status(500)
    .send({ message: 'An error has occurred on the server' });
}

// get all cards
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleErrs(err, res));
};

// add a new card
module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'card validation failed' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

// delete an existing card
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => handleErrs(err, res));
};

// like a card
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch((err) => handleErrs(err, res));

// dislike a card
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch((err) => handleErrs(err, res));
