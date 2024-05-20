const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('認証に失敗しました');
    };
    const decodedToken = jwt.verify(token, 'secret');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.error(err);
    const error = new HttpError('認証されていません', 401);
    return next(error);
  }
};