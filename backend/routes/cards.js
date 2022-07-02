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
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),

      link: Joi.string().required().custom(validateURL),
      likes: Joi.array().items(joi.string()),
    }),
  }),
  addCard
);
// delete an existing card
router.delete(
  "/cards/:cardId",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard
);
// like a card
router.put(
  "/cards/:cardId/likes",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard
);
// dislike a card
router.delete(
  "/cards/:cardId/likes",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard
);

module.exports = router;
