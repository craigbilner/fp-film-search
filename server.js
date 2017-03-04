const express = require('express');
const app = express();
const helmet = require('helmet');
const manifest = require('./manifest.json');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.static('static'));
app.use(helmet());

const htmlOpts = {
  title: 'Film Search 2000',
  bundleName: manifest.bundle.replace('public', ''),
};

app.get('/', (req, res) => res.render('index', htmlOpts));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
