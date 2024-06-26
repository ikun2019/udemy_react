const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');

const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const fs = require('fs');

// * modelのインポート
const Place = require('../models/Place');
const User = require('../models/User');


// * GET => /api/places
const getPlaces = (req, res) => {
  res.json(DUMMY_PLACES);
};

// * GET => /api/places/:pid
const getPlaceById = async (req, res, next) => {
  // const place = DUMMY_PLACES.find(item => item.id === req.params.pid);
  let place;
  try {
    place = await Place.findById(req.params.pid);
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError('idが見つかりません', 404);
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// * GET => /api/places/user/:uid
const getPlaceByUserId = async (req, res, next) => {
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(req.params.uid).populate('places');
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
  if (!userWithPlaces || userWithPlaces.length === 0) {
    const error = new HttpError('ユーザーのplaceが見つかりません', 404);
    return next(error);
  };
  res.status(200).json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};

// * POST => /api/places
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('入力内容に誤りがあります', 422))
  };

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userDate.userId,
  });

  let user;
  try {
    user = await User.findById(req.userDate.userId);
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  };
  if (!user) {
    const error = new HttpError('failed', 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlace.save({ session: sess });
    user.places.push(createPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('faild', 500);
    return next(error);
  }

  res.status(201).json({ place: createPlace });
};

// * PUT => /api/places/:pid
const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('入力内容に誤りがあります', 422));
  };

  let place;
  try {
    place = await Place.findById(req.params.pid);
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  };

  if (!place) {
    const error = HttpError('placeが見つかりません', 404);
    return next(error);
  };

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('許可されていません', 403);
    return next(error);
  };

  const { title, description } = req.body;
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('サーバーエラーです', 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// * DELETE => /api/places/:pid
const deletePlaceById = async (req, res, next) => {
  let place;
  try {
    place = await Place.findById(req.params.pid).populate('creator');
    if (!place) {
      const error = new HttpError('placeが存在しません', 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError('placeの取得に失敗しました', 500);
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('許可されていません', 403);
    return next(error);
  };

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    const error = new HttpError('placeの削除に失敗しました', 500);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.error(err);
  });

  res.status(200).json({ message: 'Deleted place.' });
};

module.exports = {
  getPlaces,
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById
};