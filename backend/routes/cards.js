const router = require('express').Router();
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// get all cards
router.get('/cards', getCards);
// add a new card
router.post('/cards', addCard);
// delete an existing card
router.delete('/cards/:cardId', deleteCard);
// like a card
router.put('/cards/:cardId/likes', likeCard);
// dislike a card
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
