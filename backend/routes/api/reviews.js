const express = require("express");
const { check } = require("express-validator");
const { requireAuth } = require("../../utils/auth");
const {
  Review,
  Spot,
  SpotImage,
  User,
  ReviewImage,
} = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//get all reviews of current user.
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "price",
          ],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
      attributes: [
        "id",
        "userId",
        "spotId",
        "review",
        "stars",
        "createdAt",
        "updatedAt",
      ],
    });
    res.status(200).json({ Reviews: reviews });
  } catch (error) {
    next(error);
  }
});

//add a image to a review from review Id
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { url } = req.body;
    const { user } = req;

    const reviews = await Review.findByPk(reviewId);

    if (!reviews) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (reviews.userId !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const imageCount = await ReviewImage.count({
      where: { reviewId },
    });

    if (imageCount >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }

    const newImage = await ReviewImage.create({
      url,
      reviewId,
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });
  } catch (error) {
    next(error);
  }
});


// DELETE a review (FIXED)
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
try {
  const { reviewId } = req.params;
  const { user } = req;
  const review = await Review.findByPk(reviewId);
if (!review) {
  return res.status(404).json({ message: "Review couldn't be found" });
}

if (review.userId !== user.id) {
  return res.status(403).json({ message: "Forbidden" });
}
await review.destroy();

return res.status(200).json({ message: "Successfully deleted" });
} catch (error) {
  next(error);
}
 });


// Edit A Review
router.put(
  "/:reviewId",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { user } = req;
      const { review, stars } = req.body;

      const existingReview = await Review.findByPk(reviewId);

      if (!existingReview) {
        return res.status(404).json({
          message: "Review couldn't be found",
        });
      }

      if (existingReview.userId !== user.id) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      await existingReview.update({
        review,
        stars,
      });

      return res.status(200).json(existingReview);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
