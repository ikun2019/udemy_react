const router = require('express').Router();

const { getPlaces, getPlaceById, getPlaceByUserId, createPlace, updatePlaceById, deletePlaceById } = require('../controllers/places.controller.js');

// * GET => /api/places
router.get('/', getPlaces);

// * GET => /api/places/:pid
router.get('/:pid', getPlaceById);

// * GET => /api/places/user/:uid
router.get('/user/:uid', getPlaceByUserId);

// * POST => /api/places
router.post('/', createPlace);

// * PUT => /api/places/:pid
router.put('/:pid', updatePlaceById);

// * DELETE => /api/places/:pid
router.delete('/:pid', deletePlaceById);

module.exports = router;