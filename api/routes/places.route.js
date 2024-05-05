const router = require('express').Router();

const { getPlaces, getPlaceById, getPlaceByUserId } = require('../controllers/places.controller.js');

// * GET => /api/places
router.get('/', getPlaces);

// * GET => /api/places/:pid
router.get('/:pid', getPlaceById);

// * GET => /api/places/user/:uid
router.get('/user/:uid', getPlaceByUserId);

module.exports = router;