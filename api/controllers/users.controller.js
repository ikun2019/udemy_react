const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const HttpError = require('../models/http-error');
const User = require('../models/User');

// * GET => /api/users
exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
  res.status(200).json({ users: users.map(u => u.toObject({ getters: true })) });
};

// * POST => /api/users/signup
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.array());
    return next(new HttpError('入力内容に誤りがあります', 422));
  }

  const { name, email, password } = req.body;
  let user;

  try {
    const hasUser = await User.findOne({ email: email });
    if (hasUser) {
      const error = new HttpError('このメールアドレスはすでに登録されています', 422);
      return next(error);
    };

    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError('再度登録してください', 500);
      return next(error);
    }

    user = new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
      places: [],
    });
    await user.save();
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
  res.status(201).json({ user: user.toObject({ getters: true }) });
};

// * POST => /api/users/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      const error = new HttpError('ユーザーが存在しません', 401);
      return next(error);
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const error = new HttpError('パスワードが一致しません', 401);
      return next(error);
    };
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
  res.status(200).json({ message: 'Logged In', user: user.toObject({ getters: true }) });
};