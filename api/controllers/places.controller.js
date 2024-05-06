const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
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

const getPlaces = (req, res) => {
  res.json(DUMMY_PLACES);
};

const getPlaceById = (req, res, next) => {
  const place = DUMMY_PLACES.find(item => item.id === req.params.pid);
  if (!place) {
    const error = new HttpError('idが見つかりません', 404);
    return next(error);
  }
  res.status(200).json(place);
};

const getPlaceByUserId = (req, res, next) => {
  const places = DUMMY_PLACES.filter(p => p.creator === req.params.uid);
  if (!places || places.length === 0) {
    const error = new HttpError('ユーザーのplaceが見つかりません', 404);
    return next(error);
  };
  res.status(200).json(places);
};

const createPlace = (req, res) => {
  const { title, description, cordinates, address, creator } = req.body;
  const createPlace = {
    id: uuidv4(),
    title,
    description,
    location: cordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createPlace);
  res.status(201).json({ place: createPlace });
};

const updatePlaceById = (req, res, next) => {
  const pid = req.params.pid;
  const { title, description } = req.body;
  const updatePlace = DUMMY_PLACES.find(place => place.id === pid);
  if (!updatePlace) {
    const error = HttpError('placeが見つかりません', 404);
    return next(error);
  };

  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === pid);
  const newPlace = {
    ...updatePlace,
    title: title,
    description: description,
  };
  DUMMY_PLACES[placeIndex] = newPlace;
  res.status(200).json({ place: newPlace });
};

const deletePlaceById = (req, res) => {
  const pid = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter(places => places.id !== pid);
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