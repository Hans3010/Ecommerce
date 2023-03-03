const { Router } = require('express');
const { check } = require('express-validator');
const {
  createUser,
  login,
  renewToken,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validIfExistsUserEmail } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

//no colocar nunca el "router.use(protect)" porque nunca voy a loggear

router.post(
  '/signup',
  [
    check('username', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    check(
      'password',
      'The password is needs a minimum of 8 characters'
    ).isLength({ min: 8, max: 64 }),
    validateFields,
    validIfExistsUserEmail,
  ],
  createUser
);
router.post(
  '/login',
  [
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    check(
      'password',
      'The password is needs a minimum of 8 characters'
    ).isLength({ min: 8, max: 64 }),
    validateFields,
  ],
  login
);
router.use(protect);

router.get('/renew', renewToken);

module.exports = {
  authRouter: router,
};
