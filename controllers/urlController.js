require('dotenv').config();

// import normalizeUrl from 'normalize-url';
const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl;
const validator = require('validator');
const Url = require('../models/urlModel');

let normalizeUrl;
(async () => {
  normalizeUrl = (await import('normalize-url')).default;
})();

const generateUrl = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var shortUrl = '';

    const URL_LEN = process.env.SHORT_URL_LENGTH || 8;

    for (let i = 0; i < URL_LEN; i++) {
        shortUrl += characters[Math.floor(Math.random() * 64)];
    }

    return shortUrl;
}

const goodUrl = (urlString) => {
    try {
        const url = new URL(urlString);
        return url.href;
    } catch (error) {
        console.error('Invalid URL:', urlString);
        return null;
    }
};

exports.shortenUrl = async (originalUrl) => {
    const sanitizedUrl = sanitizeUrl(originalUrl);

    if (sanitizedUrl == 'about:blank') {
        throw new Error('Invalid URL');
    }

    const validatedUrl = validator.isURL(sanitizedUrl);
    
    if(!validatedUrl){
        throw new Error('Invalid URL');
    }

    const normalizedUrl = normalizeUrl(sanitizedUrl, {forceHttps: true, stripHash: true});

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