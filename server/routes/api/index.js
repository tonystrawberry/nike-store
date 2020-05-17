import express from 'express';
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

router.get('/products', (req, res) => {
  const cursor = mongo.getDb().collection('products').find();
  cursor.toArray()
    .then(result => {
      res.json(result);
    }).catch(err => {
      return res.status(422).send({errors: [{title: 'Product fetch failed. Please try again.', detail: err.message }]})
    });
  });

router.post('/products', (req, res) => {
  let products = req.body;
  mongo.getDb().collection('products').insertMany(products, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Product add failed. Please try again.', detail: err.message }]})
    }
    console.log("MONGO LOG - Products added", products);
    return res.json(products);
  });
});

router.put('/products/:id', (req, res) => {
  let id = req.params.id;
  let product = req.body;
  mongo.getDb().collection('products').updateOne({'_id': id}, product, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Product update failed. Please try again.', detail: err.message }]})
    }
    console.log("MONGO LOG - Product updated", product);
    return res.json(product);
  });
});

router.delete('/products/:id', (req, res) => {
  let id = req.params.id;
  let product = req.body;
  mongo.getDb().collection('products').deleteOne({'_id': id}, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Product delete failed. Please try again.', detail: err.message }]})
    }
    console.log("MONGO LOG - Product deleted", product);
    return res.json({id: id});
  });
});


module.exports = router;
