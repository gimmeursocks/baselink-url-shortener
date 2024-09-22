require('dotenv').config();

const { URL } = require('url');
const Url = require('../models/urlModel');
const { ValidationError } = require('sequelize');

const generateUrl = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var shortUrl = '';

    for (let i = 0; i < process.env.SHORT_URL_LENGTH; i++) {
        shortUrl += characters[Math.floor(Math.random() * 64)];
    }

    console.log(shortUrl);

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
    if (normalizedUrl) {
        const urlEntry = await Url.findOne({ where: { originalUrl: normalizedUrl } });

        if (urlEntry) {
            return `/api/${urlEntry.shortUrl}`;
        } else {
            const shortUrl = generateUrl();
            const newUrl = await Url.create({ originalUrl: normalizedUrl, shortUrl });
            return `/api/${shortUrl}`;
        }
    } else {
        throw new Error('Invalid URL');
    }
};

exports.redirectUrl = async (req, res) => {
    const shortUrl = req.params.shortUrl;

    console.log("redirect")
    console.log(shortUrl)

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