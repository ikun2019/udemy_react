const router = require('express').Router();
const { check } = require('express-validator');

const { getPlaces, getPlaceById, getPlaceByUserId, createPlace, updatePlaceById, deletePlaceById } = require('../controllers/places.controller.js');

// * GET => /api/places
router.get('/', getPlaces);

// * GET => /api/places/:pid
router.get('/:pid', getPlaceById);

// * GET => /api/places/user/:uid
router.get('/user/:uid', getPlaceByUserId);

// * POST => /api/places
router.post('/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  createPlace);

// * PUT => /api/places/:pid
router.put('/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  updatePlaceById);

// * DELETE => /api/places/:pid
router.delete('/:pid', deletePlaceById);

module.exports = router;