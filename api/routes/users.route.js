const { check } = require('express-validator');
const { getUsers, signup, login } = require('../controllers/users.controller');
const fileUpload = require('../middleware/file-upload');

const router = require('express').Router();

// @GET => /api/users
router.get('/', getUsers);

// @POST => /api/users/signup
router.post('/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  signup
);

// @POST => /api/users/login
router.post('/login', login);

module.exports = router;