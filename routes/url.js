const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    try {
        const shortUrl = await urlController.shortenUrl(originalUrl);
        res.render('result', { originalUrl, shortUrl });
    } catch (error) {
        console.log(error);
        if (error.message && error.message.includes('Invalid URL')) {
            res.render('index', { error: `${originalUrl} is not a valid URL.` });
        } else {
            res.status(500).send('Error occurred');
        }
    }
});

router.get('/:shortUrl', urlController.redirectUrl);

module.exports = router;