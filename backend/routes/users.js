const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUser,
  addUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

// get all users
router.get("/users", getUsers);
// get a user based on the id
router.get("/users/:id", getUser);
// update profile
router.patch("/users/me", updateProfile);
// update Avatar`
router.patch("/users/me/avatar", updateAvatar);
// signin
router.post("/signin", login);
// sigup
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.link(),
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  addUser
);

module.exports = router;
