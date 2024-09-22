require('dotenv').config();

const express = require('express');
const app = express();
const indexRoutes = require('./routes/index');
const urlRoutes = require('./routes/url');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static
app.use(express.static('public'));

// Routes
app.use('/', indexRoutes);
app.use('/api', urlRoutes);

// Logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Templating Engine
app.set('view engine', 'ejs');
app.set('views', './views');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});