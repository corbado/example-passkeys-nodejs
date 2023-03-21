const express = require('express');
const app = express();
const ejs = require('ejs');
require('dotenv').config();

app.set('views', './src/views')
app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
