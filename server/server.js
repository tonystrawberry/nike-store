import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import authJwt from './middlewares/authJwt'

require('dotenv').config()

const app = express();
const apiProducts = require('./routes/api/products');
const apiUsers = require('./routes/api/users');
const auth = require('./routes/api/auth');

const mongo = require('./db/mongodb');

mongo.connectToServer( function( err, client ) {
  if (err) console.log(err);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(morgan('combined'));
  app.use('/api/products', apiProducts);
  app.use('/api/users', authJwt.verifyToken, apiUsers);
  app.use('/auth', auth);
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });

  app.get('/*',  (req, res) => {
    res.redirect('/');
  });

  app.set('port', (process.env.PORT || 3001));
  app.listen(app.get('port'), () => {
    console.log(`Listening on ${app.get('port')}...`);
  });

});


