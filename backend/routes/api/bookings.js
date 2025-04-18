const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Booking, Spot, User } = require('../../db/models');

const router = express.Router();

//GET CURRENT USERS BOOKINGS
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
      }
    });

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    next(error);
  }
});

//EDIT A BOOKING
router.put('/:bookingId', requireAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to edit this booking" });
    }

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    const today = new Date();

    if (newStartDate < today || newEndDate < today) {
      return res.status(400).json({ message: "Bookings cannot be made in the past" });
    }

    if (newEndDate <= newStartDate) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const existingBooking = await Booking.findOne({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: bookingId },
        [Op.or]: [
          { startDate: { [Op.between]: [newStartDate, newEndDate] } },
          { endDate: { [Op.between]: [newStartDate, newEndDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: newStartDate } },
              { endDate: { [Op.gte]: newEndDate } }
            ]
          }
        ]
      }
    });

    if (existingBooking) {
      return res.status(403).json({ message: "Sorry, this spot is already booked!" });
    }

    await booking.update({ startDate, endDate });

    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

//DELETE A BOOKING
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    const today = new Date();
    const startDate = new Date(booking.startDate);

    if (startDate <= today) {
      return res.status(403).json({ message: "Bookings that have started cannot be deleted" });
    }
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this booking" });
    }

    await booking.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;