const express = require('express');
const router = express.Router();

// Import API routes
const apiRouter = require('./api');
router.use('/api', apiRouter); // Only use API router


// CSRF Route
router.get("/api/csrf/restore", (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.status(200).json({ "XSRF-Token": req.csrfToken() });
});


// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});


module.exports = router;