const router = require('express').Router();

// * GET => /api/users
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'users page'
  })
});

module.exports = router;