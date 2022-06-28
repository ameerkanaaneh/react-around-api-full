const router = require("express").Router();
const { celebrate, Joi, errors } = require("celebrate");
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// get all cards
router.get("/cards", getCards);
// add a new card
router.post(
  "/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),

      link: Joi.string().required().custom(validateURL),
    }),
  }),
  addCard
);
// delete an existing card
router.delete("/cards/:cardId", deleteCard);
// like a card
router.put("/cards/:cardId/likes", likeCard);
// dislike a card
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
