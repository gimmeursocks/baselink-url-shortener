require('dotenv').config();

const { URL } = require('url');
const Url = require('../models/urlModel');

const generateUrl = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var shortUrl = '';

    const URL_LEN = process.env.SHORT_URL_LENGTH || 8;

    for (let i = 0; i < URL_LEN; i++) {
        shortUrl += characters[Math.floor(Math.random() * 64)];
    }

    return shortUrl;
}

const normalizeUrl = (urlString) => {
    try {
        const url = new URL(urlString);
        return url.href;
    } catch (error) {
        console.error('Invalid URL:', urlString);
        return null;
    }
};

exports.shortenUrl = async (originalUrl) => {
    const normalizedUrl = normalizeUrl(originalUrl);

    if (!normalizedUrl) {
        throw new Error('Invalid URL');
    }

    const urlEntry = await Url.findOne({ where: { originalUrl: normalizedUrl } });

    if (urlEntry) {
        return `/api/${urlEntry.shortUrl}`;
    }

    let shortUrl;

    while (true) {
        try {
            shortUrl = generateUrl();
            await Url.create({ originalUrl: normalizedUrl, shortUrl });
            break;
        } catch (error) {
            console.log(`Collision detected, regenerating short URL...`);
            continue;
        }
    }
    return `/api/${shortUrl}`;
};

exports.redirectUrl = async (req, res) => {
    const shortUrl = req.params.shortUrl;

    try {
        const urlEntry = await Url.findOne({ where: { shortUrl } });

        if (urlEntry) {
            res.redirect(urlEntry.originalUrl);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).send('Internal server error');
    }
};