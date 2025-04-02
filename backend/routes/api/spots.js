const express = require('express');
const router = express.Router();
const { Spot, SpotImage, User, Review, Booking } = require('../../db/models'); // Sequelize models
const { requireAuth } = require('../../utils/auth'); // Authentication middleware
const { check } = require('express-validator'); // Validation utilities
const { handleValidationErrors } = require('../../utils/validation'); // Validation error handler

// Validation Middleware for Spot Fields
const validateSpot = [
  check('address').exists({ checkFalsy: true }).withMessage('Street address is required.'),
  check('city').exists({ checkFalsy: true }).withMessage('City is required.'),
  check('state').exists({ checkFalsy: true }).withMessage('State is required.'),
  check('country').exists({ checkFalsy: true }).withMessage('Country is required.'),
  check('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90.'),
  check('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180.'),
  check('name').isLength({ max: 50 }).withMessage('Name must be less than 50 characters.'),
  check('description').exists({ checkFalsy: true }).withMessage('Description is required.'),
  check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
  handleValidationErrors,
];

// Validation Middleware for Query Filters
const validateQueryFilters = [
  check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  check('size').optional().isInt({ min: 1 }).withMessage('Size must be a positive integer.'),
  handleValidationErrors,
];

// GET /api/spots - Get All Spots
router.get('/', validateQueryFilters, async (req, res) => {
  const { page = 1, size = 20 } = req.query;

  const limit = parseInt(size, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  const spots = await Spot.findAll({
    limit,
    offset,
    include: [
      {
        model: SpotImage,
        attributes: ['url', 'preview'],
        as: 'spotImages' // Ensure this alias matches your association definition
      },
    ],
  });

  res.json({ Spots: spots, page: parseInt(page, 10), size: parseInt(size, 10) });
});

// GET /api/spots/current - Get Spots Owned by Current User
router.get('/current', requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
    where: { ownerId: req.user.id },
  });
  res.json({ Spots: spots });
});

// GET /api/spots/:id - Get Spot Details
router.get('/:id', async (req, res) => {
  const spot = await Spot.findByPk(req.params.id, {
    include: [
      { model: SpotImage, attributes: ['id', 'url', 'preview'], as: 'spotImages' },
      { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  res.json(spot);
});

// POST /api/spots - Create a New Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(newSpot);
});

// POST /api/spots/:id/images - Add an Image to a Spot
router.post('/:id/images', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { url, preview } = req.body;
  const newImage = await SpotImage.create({ spotId: spot.id, url, preview });

  res.status(201).json(newImage);
});

// PUT /api/spots/:id - Edit a Spot
router.put('/:id', requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  await spot.update({ address, city, state, country, lat, lng, name, description, price });

  res.json(spot);
});

// DELETE /api/spots/:id - Delete a Spot
router.delete('/:id', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await spot.destroy();
  res.json({ message: 'Successfully deleted' });
});

module.exports = router;