const HttpError = require('../models/http-error');

const router = require('express').Router();

const DUMMY_PLACES = [
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
router.get('/', (req, res) => {
  res.json({
    message: 'places page',
  });
});

// * GET => /api/places/:pid
router.get('/:pid', (req, res, next) => {
  const place = DUMMY_PLACES.find(item => item.id === req.params.pid);
  if (!place) {
    const error = new HttpError('idが見つかりません', 404);
    return next(error);
  }
  res.status(200).json(place);
});

// * GET => /api/places/user/:uid
router.get('/user/:uid', (req, res) => {
  const place = DUMMY_PLACES.find(item => item.creator === req.params.uid);
  if (!place) {
    const error = new HttpError('ユーザーが見つかりません', 404);
    return next(error);
  };
  res.status(200).json(place);
});

module.exports = router;