const express = require('express');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');

const router = express.Router();

// Validation middleware for reviews
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required.'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer between 1 and 5.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// GET /api/reviews/current
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const reviews = await Review.findAll({
    where: { userId },
    include: [
      { model: User },
      {
        model: Spot,
        include: [{ model: SpotImage, as: 'previewImage' }],
      },
      { model: ReviewImage },
    ],
  });

  const formattedReviews = reviews.map(review => {
    const reviewData = review.toJSON();
    reviewData.Spot.previewImage = reviewData.Spot.SpotImages.find(image => image.preview) || null;
    delete reviewData.Spot.SpotImages;
    return reviewData;
  });

  res.json({ reviews: formattedReviews });
});

// POST /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (review.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const imageCount = await ReviewImage.count({ where: { reviewId } });
  if (imageCount >= 10) {
    return res.status(403).json({ error: 'Maximum number of images reached' });
  }

  const newImage = await ReviewImage.create({ reviewId, url });
  res.status(201).json({ id: newImage.id, url: newImage.url });
});

// PUT /api/reviews/:reviewId - Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  const existingReview = await Review.findByPk(reviewId);
  if (!existingReview) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (existingReview.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  existingReview.review = review;
  existingReview.stars = stars;
  await existingReview.save();

  res.json(existingReview);
});

// DELETE /api/reviews/:reviewId - Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  const existingReview = await Review.findByPk(reviewId);
  if (!existingReview) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (existingReview.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await existingReview.destroy();

  res.json({ message: 'Review deleted successfully' });
});

module.exports = router;