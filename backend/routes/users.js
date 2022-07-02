const router = require("express").Router();
const { celebrate, Joi, errors } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getMyUser,
} = require("../controllers/users");

// get all users
router.get(
  "/users",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
  }),
  getUsers
);
// get a user based on the id
router.get(
  "/users/:id",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
    params: Joi.object().keys({
      id: Joi.string()
        .regex(/^[A-Fa-f0-9]*/)
        .required(),
    }),
  }),
  getUser
);
// get user data
router.get(
  "/users/me",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
  }),
  getMyUser
);
// update profile
router.patch(
  "/users/me",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile
);
// update Avatar`
router.patch(
  "/users/me/avatar",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string()
        .regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  updateAvatar
);

module.exports = router;
