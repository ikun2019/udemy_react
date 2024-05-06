const { getUsers, signup, login } = require('../controllers/users.controller');

const router = require('express').Router();

// * GET => /api/users
router.get('/', getUsers);

// * POST => /api/users/signup
router.post('/signup', signup);

// * POST => /api/users/login
router.post('/login', login);

module.exports = router;