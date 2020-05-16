import express from 'express';

const mongo = require('../../db/mongodb');
var router = express.Router();

router.get('/products', (req, res) => {
  const cursor = mongo.getDb().collection('products').find();
  cursor.toArray()
    .then(results => {
      res.json(results);
    }).catch(error => {
      res.json([]);
    });
  });


module.exports = router;
