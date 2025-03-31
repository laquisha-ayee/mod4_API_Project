const express = require('express');
const router = express.Router();
const { Booking, Spot, SpotImage, User } = require('../../db/models'); 
const { requireAuth } = require('../../utils/auth'); 
const { check } = require('express-validator'); 
const { handleValidationErrors } = require('../../utils/validation'); 
const { Op } = require('sequelize'); 


const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid date.')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Start date cannot be in the past.');
      }
      return true;
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid date.')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date.');
      }
      return true;
    }),
  handleValidationErrors, 
];


router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: { userId },
    include: {
      model: Spot,
      include: {
        model: SpotImage,
        attributes: ['url'], 
      },
    },
  });

  res.json({ Bookings: bookings });
});


router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  
  if (new Date() > new Date(booking.startDate)) {
    return res.status(403).json({ message: 'Past bookings cannot be modified' });
  }

  
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: booking.spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: startDate } },
            { endDate: { [Op.gte]: endDate } },
          ],
        },
      ],
      id: { [Op.ne]: booking.id }, 
    },
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: 'Conflicting booking exists.',
    });
  }

  
  booking.startDate = startDate;
  booking.endDate = endDate;
  await booking.save();

  res.json(booking);
});


router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  
  if (booking.userId !== req.user.id) {
    const spot = await Spot.findByPk(booking.spotId);
    if (!spot || spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  }

  
  if (new Date() >= new Date(booking.startDate)) {
    return res.status(403).json({
      message: 'Bookings that have started cannot be deleted',
    });
  }

  await booking.destroy();
  res.json({ message: 'Successfully deleted' });
});

module.exports = router;
