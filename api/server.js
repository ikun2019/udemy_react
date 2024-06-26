const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// * データベースを接続
const connectDB = require('./config/db');
connectDB();

const HttpError = require('./models/http-error');

// * routerのimport
const placesRouter = require('./routes/places.route');
const usersRouter = require('./routes/users.route');

// * Expressの初期設定
const app = express();
app.use(express.json(), express.urlencoded({ extended: false }), cors());

// * publicフォルダの指定
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// * routerをExpressに結合
app.use('/api/places', placesRouter);
app.use('/api/users', usersRouter);

// * 404Error
app.use((req, res, next) => {
  const error = new HttpError('Cound not find this route.', 404);
  return next(error);
});
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  };
  if (res.headersSent) {
    return next(error);
  };
  res.status(error.code || 500).json({
    message: error.message || "Unknown error",
  });
});

// * アプリの起動
app.listen({ port: 8080 }, () => {
  console.log('Server is running!');
});