const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/User');

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
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('入力内容に誤りがあります', 422));
  }

  const { name, email, password, places } = req.body;
  let user;
  try {
    const hasUser = await User.findOne({ email: email });
    if (hasUser) {
      const error = new HttpError('このメールアドレスはすでに登録されています', 422);
      return next(error);
    };
    user = new User({
      name,
      email,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kaioke_%28lacquer_container_for_shell_matching_game%29%2C_Japan.jpg/800px-Kaioke_%28lacquer_container_for_shell_matching_game%29%2C_Japan.jpg',
      password,
      places,
    });
    await user.save();
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
  res.status(201).json({ user: user.toObject({ getters: true }) });
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