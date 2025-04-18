const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js'); 
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings');


const { User, SpotImage, ReviewImage } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user });
});

router.get('/restore-user', (req, res) => {
  return res.json(req.user);
});

router.get('/require-auth', requireAuth, (req, res) => {
  return res.json(req.user);
});

//DELETE A SPOT IMAGE
router.delete('/spot-images/:imageId', requireAuth, async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const { user } = req;


    const spotImages = await SpotImage.findByPk(imageId);

    if (!spotImages) {
      return res.status(404).json({
        message: "Spot Image couldn't be found"
      });
    }
    if (spotImages.userId !== user.id) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }
    await spotImages.destroy();

    return res.status(200).json({
      message: "Successfully deleted"
    });

  } catch (e) {
   next(error);
  }
});


//DELETE A REVIEW IMAGE
router.delete('/review-images/:imageId', requireAuth, async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const { user } = req;


    const reviewImages = await ReviewImage.findByPk(imageId);

    if (!reviewImages) {
      return res.status(404).json({
        message: "Review Image couldn't be found"
      });
    }
    if (reviewImages.userId !== user.id) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }
    await reviewImages.destroy();

    return res.status(200).json({
      message: "Successfully deleted"
    });

  } catch (e) {
    next(error);
  }
});


module.exports = router;
