const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// const validateURL = (value, helpers) => {
//   if (validator.isURL(value)) {
//     return value;
//   }
//   return helpers.error("string.uri");
// };

// get all cards
router.get("/", getCards);
// add a new card
router.post(
  "/",
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().required().min(2).max(30),
  //     // link: Joi.string()
  //     //   .required()
  //     //   .pattern(
  //     //     /^(http:\/\/|https:\/\/)(w{3}\.)?([\w\-\/\(\):;,\?]+\.{1}?[\w\-\/\(\):;,\?]+)+#?$/
  //     //   ),
  //   }),
  // }),
  addCard
);
// delete an existing card
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard
);
// like a card
router.put(
  "/likes/:cardId/",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard
);
// dislike a card
router.delete(
  "/likes/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard
);

module.exports = router;
