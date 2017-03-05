const express = require('express');
const app = express();
const helmet = require('helmet');
const manifest = require('./manifest.json');
const request = require('request');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.static('static'));
app.use(helmet());

const htmlOpts = {
  title: 'Film Search 2000',
  bundleName: manifest.bundle.replace('public', ''),
};

const makeURL = (AUTH_KEY, term) =>
'https://api.themoviedb.org/3/search/multi' +
'?api_key=' + AUTH_KEY +
'&language=en-US' +
'&query=' + term +
'&page=1' +
'&include_adult=false';

app.get('/config', (req, res) => {
  request(`https://api.themoviedb.org/3/configuration?api_key=${process.env.API_KEY}`)
    .pipe(res);
});

app.get('/find/:q', (req, res) => {
  request(makeURL(process.env.API_KEY, req.params.q))
    .pipe(res);
});

app.get('/', (req, res) => res.render('index', htmlOpts));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
