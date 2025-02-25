const express = require('express');
const { handleGenerateNewShortURL, handleAnalytics } = require('../controllers/url')
const router = express.Router();

router.post("/", handleGenerateNewShortURL);


router.get('/analytics/:shortID', handleAnalytics);

module.exports = router;