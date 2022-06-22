const router = require('express').Router();
const {
  getUsers,
  getUser,
  addUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// get all users
router.get('/users', getUsers);
// get a user based on the id
router.get('/users/:id', getUser);
// add a new user
router.post('/users', addUser);
// update profile
router.patch('/users/me', updateProfile);
// update Avatar
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
