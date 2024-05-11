const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

// * modelのインポート
const Place = require('../models/Place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous scrapers in the world.',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    address: '20 W 34th St., New York, NY 10001',
    creator: 'u1'
  }
]

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
  // const places = DUMMY_PLACES.filter(p => p.creator === req.params.uid);
  let places;
  try {
    places = await Place.find({ creator: req.params.uid });
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
  if (!places || places.length === 0) {
    const error = new HttpError('ユーザーのplaceが見つかりません', 404);
    return next(error);
  };
  res.status(200).json({ places: places.map(place => place.toObject({ getters: true })) });
};

// * POST => /api/places
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('入力内容に誤りがあります', 422))
  };

  const { title, description, address, creator } = req.body;

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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Front_Facade_Judes_Church_Chinnathurai_Mar24_A7C_09994.jpg/800px-Front_Facade_Judes_Church_Chinnathurai_Mar24_A7C_09994.jpg',
    creator,
  })

  // DUMMY_PLACES.push(createPlace);
  try {
    await createPlace.save();
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
    place = await Place.findByIdAndUpdate(req.params.pid, {
      $set: req.body,
    });
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  };

  if (!place) {
    const error = HttpError('placeが見つかりません', 404);
    return next(error);
  };

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// * DELETE => /api/places/:pid
const deletePlaceById = async (req, res, next) => {
  try {
    await Place.findByIdAndDelete(req.params.pid);
  } catch (err) {
    const error = new HttpError('failed', 500);
    return next(error);
  }
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