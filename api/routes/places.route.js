const router = require('express').Router();
const { check } = require('express-validator');

const fileUpload = require('../middleware/file-upload.js');
const checkAuth = require('../middleware/check-auth.js');

const { getPlaces, getPlaceById, getPlaceByUserId, createPlace, updatePlaceById, deletePlaceById } = require('../controllers/places.controller.js');

// @GET => /api/places
router.get('/', getPlaces);

// @GET => /api/places/:pid
router.get('/:pid', getPlaceById);

// @GET => /api/places/user/:uid
router.get('/user/:uid', getPlaceByUserId);

// * 認証ミドルウェア
router.use(checkAuth);

// @POST => /api/places
router.post('/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  createPlace);

// @PUT => /api/places/:pid
router.put('/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  updatePlaceById);

// @DELETE => /api/places/:pid
router.delete('/:pid', deletePlaceById);

module.exports = router;