const Card = require("../models/card");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const AuthError = require("../errors/AuthError");

function handleErrs(err, res) {
  if (err.name === "CastError") {
    return res.status(400).send({ message: "NotValid Data" });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(404).send({ message: "Card not found" });
  }
  return res
    .status(500)
    .send({ message: "An error has occurred on the server" });
}

// get all cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new Error("An error occured on the server");
      }
      res.send({ data: cards });
    })
    .catch(next);
};

// add a new card
module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Unable to create card, Please try again");
      }
    })
    .catch(next);
};

// delete an existing card
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card && req.user._id.toString() === card.owner.toString()) {
        Card.deleteOne(card).then((deletedCard) => {
          res.send({ data: deletedCard });
        });
      } else if (!card) {
        throw new NotFoundError("Card not found");
      } else {
        throw new AuthError(
          "You need to be the owner of the card to delete it"
        );
      }
    })
    .catch(next);
};

// like a card
module.exports.likeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      res.send({ data: card });
    })
    .catch(next);

// dislike a card
module.exports.dislikeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      res.send({ data: card });
    })
    .catch(next);
