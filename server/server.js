import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

const app = express();
const apiRoutes = require('./apiRoutes/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, '../../client/build'), {index: false, redirect: false}));

app.set('port', (process.env.PORT || 3001));
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}...`);
});

