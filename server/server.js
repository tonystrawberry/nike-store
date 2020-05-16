import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
require('dotenv').config()

const app = express();
const apiRoutes = require('./routes/api/index');
const mongo = require('./db/mongodb');

mongo.connectToServer( function( err, client ) {
  if (err) console.log(err);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use('/api', apiRoutes);
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


