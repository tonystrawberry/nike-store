import express from 'express';
import authJwt from '../../middlewares/authJwt';

const router = express.Router();

const mongo = require('../../db/mongodb');
const upload = require('../../services/image-upload');

const singleUpload = upload.single('image');

router.get('/ping', (req, res) => {
  res.send("pong");
});

router.post('/image-upload', (req, res) => {
  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image upload failed. Please try again.', detail: err.message }]})
    }
    return res.json({ 'imageUrl': req.file.location });
  });
});

/***** PRODUCTS API */

router.get('/', (req, res) => {
  const cursor = mongo.getDb().collection('products').find();
  cursor.toArray()
    .then(result => {
      res.json(result);
    }).catch(err => {
      return res.status(422).send({errors: [{title: 'Product fetch failed. Please try again.', detail: err.message }]})
    });
  });

router.post('/', authJwt.verifyToken, (req, res) => {
  let products = req.body;
  mongo.getDb().collection('products').insertMany(products, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Product add failed. Please try again.', detail: err.message }]})
    }
    return res.json(products);
  });
});

router.put('/:id', authJwt.verifyToken, (req, res) => {
  let id = req.params.id;
  let product = req.body;
  mongo.getDb().collection('products').updateOne({'_id': id}, product, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Product update failed. Please try again.', detail: err.message }]})
    }
    return res.json(product);
  });
});

router.delete('/:id', authJwt.verifyToken, (req, res) => {
  let id = req.params.id;
  let product = req.body;
  mongo.getDb().collection('products').deleteOne({'_id': id}, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Product delete failed. Please try again.', detail: err.message }]})
    }
    return res.json({id: id});
  });
});

module.exports = router;
