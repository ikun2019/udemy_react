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
router.get('/:pid', (req, res) => {
  const place = DUMMY_PLACES.find(item => item.id === req.params.pid);
  if (!place) {
    return res.status(404).json({
      message: 'Not Found'
    });
  }
  res.status(200).json(place);
});

module.exports = router;