const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const {
  Review,
  Spot,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { Sequelize, Op } = require("sequelize");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === "") return true;
      const num = parseFloat(value);
      return num >= -90 && num <= 90;
    })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === "") return true;
      const num = parseFloat(value);
      return num >= -180 && num <= 180;
    })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("startDate is required")
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      if (startDate < today) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),

  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("endDate is required")
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateQueryParams = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];
//get spots owned by currnet user
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const spots = await Spot.findAll({
      where: { ownerId: userId },
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
          [Sequelize.literal("'image url'"), "previewImage"],
        ],
      },
      include: [
        {
          model: Review,
          attributes: [],
        },
        {
          model: SpotImage, //Include SpotImage to fetch the preview image
          attributes: ["url"],
          where: { preview: true },
          required: false,
        },
      ],
      group: [
        "Spot.id",
        "Spot.ownerId",
        "Spot.address",
        "Spot.city",
        "Spot.state",
        "Spot.country",
        "Spot.lat",
        "Spot.lng",
        "Spot.name",
        "Spot.description",
        "Spot.price",
        "Spot.createdAt",
        "Spot.updatedAt",
        "SpotImages.id",
      ],
      limit: size,
      offset: (page - 1) * size,
      subQuery: false,
      distinct: true,
    });

    const formattedSpots = spots.map((spot) => ({
      ...spot.toJSON(),
      previewImage:
        spot.SpotImages?.length > 0
          ? spot.SpotImages[0].url
          : "/default-image.png", //Ensure preview image is available
    }));

    return res.status(200).json({ Spots: spots });
  } catch (error) {
    next(error);
  }
});

//GET DETAILS OF SPOT FROM SPOTID
router.get("/:spotId", async (req, res, next) => {
  try {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "Owner",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const reviewStats = await Review.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "numReviews"],
        [Sequelize.fn("AVG", Sequelize.col("stars")), "avgStarRating"],
      ],
      where: { spotId },
      raw: true,
    });
    return res.status(200).json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: reviewStats.numReviews,
      avgStarRating: reviewStats.avgStarRating,
      SpotImages: spot.SpotImages,
      Owner: spot.Owner,
    });
  } catch (error) {
    next(error);
  }
});

//GET ALL SPOTS & QUERY
router.get("/", validateQueryParams, async (req, res, next) => {
  try {
    let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice, page, size } =
      req.query;

    page = parseInt(page);
    size = parseInt(size);

    // Default values for pagination
    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(size) || size < 1) size = 20;

    const query = {};

    // Add filtering conditions
    if (minLat !== undefined) query.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat !== undefined)
      query.lat = { ...query.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng !== undefined) query.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng !== undefined)
      query.lng = { ...query.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice !== undefined)
      query.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice !== undefined)
      query.price = { ...query.price, [Op.lte]: parseFloat(maxPrice) };

    const spots = await Spot.findAll({
      where: query,
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
          [Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), "numReviews"],
        ],
      },
      include: [
        {
          model: SpotImage,
          attributes: ["url"],
          where: { preview: true }, // ✅ Fetch the actual preview image
          required: false,
        },
        {
          model: Review,
          attributes: [],
          required: false,
        },
      ],

      group: ["Spot.id", "SpotImages.id"],
      limit: size,
      offset: (page - 1) * size,
      subQuery: false,
    });

    res.status(200).json({ Spots: spots, page, size });
  } catch (error) {
    next(error);
  }
});

//CREATE A SPOT

router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  try {
    console.log("Received Spot Data:", req.body);
    console.log("Received Spot Creation Data:", req.body);
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    const { user } = req;

    if (
      !address ||
      !city ||
      !state ||
      !country ||
      !description ||
      !name ||
      !price
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    const newSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      name,
      description,
      price: parseFloat(price),
    });

    return res.status(201).json(newSpot);
  } catch (error) {
    console.error("Error creating spot:", error);
    next(error);
  }
});

//Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const { user } = req;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await spot.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    next(error);
  }
});

// Edit A Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description } =
      req.body;
    let { price } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    price = parseFloat(price);

    if (isNaN(price)) {
      return res
        .status(400)
        .json({ error: "Price per day must be a positive number" });
    }
    await spot.update({
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

    return res.status(200).json(spot);
  } catch (error) {
    next(error);
  }
});

// Add Image to Spot
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const { url, preview, userId } = req.body;
    const { user } = req;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const newImage = await SpotImage.create({
      spotId,
      url,
      preview,
      userId,
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  } catch (error) {
    next(error);
  }
});

//CREATE A REVIEW FOR A SPOT BASED ON SPOTID
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    try {
      const { spotId } = req.params;
      const { review, stars } = req.body;

      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found",
        });
      }

      const reviews = await Review.findOne({
        where: {
          userId: req.user.id,
          spotId: spot.id,
        },
      });

      if (reviews) {
        return res.status(500).json({
          message: "User already has a review for this spot",
        });
      }

      const newReview = await Review.create({
        userId: req.user.id,
        spotId,
        review,
        stars,
      });

      return res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  }
);

//GET ALL REVIEWS BY A SPOTS ID
router.get("/:spotId/reviews", async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }
    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });
    return res.status(200).json({ Reviews: reviews });
  } catch (error) {
    next(error);
  }
});

// Get bookings for a spot
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  try {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const isOwner = spot.ownerId === req.user.id;

    let bookings;

    if (isOwner) {
      bookings = await Booking.findAll({
        where: { spotId },
        attributes: [
          "id",
          "spotId",
          "userId",
          "startDate",
          "endDate",
          "createdAt",
          "updatedAt",
        ],
        include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
      });

      let orderedBookings = [];
      for (let booking of bookings) {
        orderedBookings.push({
          User: booking.User,
          id: booking.id,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        });
      }
      bookings = orderedBookings;
    } else {
      bookings = await Booking.findAll({
        where: { spotId },
        attributes: ["spotId", "startDate", "endDate"],
      });
    }
    return res.status(200).json({ Bookings: bookings });
  } catch (error) {
    next(error);
  }
});

// Create a booking for a spot
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    try {
      const { spotId } = req.params;
      const { startDate, endDate } = req.body;
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      if (spot.ownerId === req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      const existingBooking = await Booking.findOne({
        where: {
          spotId,
          [Op.or]: [
            { startDate: { [Op.between]: [newStartDate, newEndDate] } },
            { endDate: { [Op.between]: [newStartDate, newEndDate] } },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: newStartDate } },
                { endDate: { [Op.gte]: newEndDate } },
              ],
            },
          ],
        },
      });
      if (existingBooking) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
        });
      }

      // Create a new booking
      const newBooking = await Booking.create({
        userId: req.user.id,
        spotId,
        startDate,
        endDate,
      });

      return res.status(201).json({
        id: newBooking.id,
        userId: newBooking.userId,
        spotId: newBooking.spotId,
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
