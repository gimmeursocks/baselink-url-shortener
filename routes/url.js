const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.post('/shorten', async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const { originalUrl } = req.body;

    try {
        let shortUrl = await urlController.shortenUrl(originalUrl);
        shortUrl = `${baseUrl}${shortUrl}`;
        res.render('result', { title: "Result", originalUrl, shortUrl });
    } catch (error) {
        console.log(error);
        if (error.message && error.message.includes('Invalid URL')) {
            res.render('index', { title: "Home", error: `${originalUrl} is not a valid URL` });
        } else {
            res.status(500).send('Error occurred');
        }
    }
});

router.get('/:shortUrl', urlController.redirectUrl);

module.exports = router;