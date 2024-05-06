const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max',
    email: 'test@test.com',
    password: '12345678',
  }
]

// * GET => /api/users
exports.getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

// * POST => /api/users/signup
exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const createUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createUser);
  res.status(201).json({ users: createUser });
};

// * POST => /api/users/login

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(u => u.email === email);
  if (!user) {
    const error = new HttpError('ユーザーが存在しません', 401);
    return next(error);
  };
  if (user.password !== password) {
    const error = new HttpError('パスワードが一致しません', 401);
    return next(error);
  };
  res.status(200).json({ message: 'Logged In' });
};