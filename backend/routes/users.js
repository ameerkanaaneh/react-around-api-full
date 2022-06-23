const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

// get all users
router.get("/users", getUsers);
// get a user based on the id
router.get("/users/:id", getUser);
// get user data
router.get("/users/me", getMyUser);
// update profile
router.patch("/users/me", updateProfile);
// update Avatar`
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
