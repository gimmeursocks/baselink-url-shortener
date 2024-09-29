const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: "Home", error: "" });
});

router.get('/about', (req, res) => {
    res.render('about', { title: "About" });
});

module.exports = router;