const express = require('express');
const cors = require('cors');

// * routerのimport
const placesRouter = require('./routes/places.route');
const usersRouter = require('./routes/users.route');

// * Expressの初期設定
const app = express();
app.use(express.json(), express.urlencoded({ extended: false }), cors());

// * routerをExpressに結合
app.use('/api/places', placesRouter);
app.use('/api/users', usersRouter);

app.use((error, req, res, next) => {
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