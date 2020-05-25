import express from 'express';
import authJwt from '../../middlewares/authJwt';
import mongodb from 'mongodb';

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
  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image upload failed. Please try again.', detail: err.message }]})
    }

    let product = req.body;
    product.price = parseInt(product.price);
    product.imageUrl = req.file.location;
    mongo.getDb().collection('products').insertOne(product, (err, response) => {
      if (err) {
        return res.status(422).send({errors: [{title: 'Product add failed. Please try again.', detail: err.message }]})
      }
      let product = response.ops[0];
      return res.json(product);
    });
  });

  
});

router.put('/', authJwt.verifyToken, (req, res) => {
  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image upload failed. Please try again.', detail: err.message }]})
    }

    let product = req.body;
    product.price = parseInt(product.price);

    let setFields = { title: product.title, subtitle1: product.subtitle1, subtitle2: product.subtitle2, description: product.description, price: product.price }
    if (req.file != undefined){
      setFields.imageUrl = req.file.location;
    }

    let fields = {
      $set: setFields
    }

    console.log("fields", fields)
    mongo.getDb().collection('products').findOneAndUpdate({'_id': mongodb.ObjectId(product.id)}, fields, { 'returnOriginal': false }, (err, response) => {
      if (err) {
        return res.status(422).send({errors: [{title: 'Product update failed. Please try again.', detail: err.message }]})
      }

      if (setFields.title != response.value.title ||
        setFields.subtitle1 != response.value.subtitle1 ||
        setFields.subtitle2 != response.value.subtitle2 ||
        setFields.price != response.value.price ||
        setFields.description != response.value.description ||
        (setFields.imageUrl != null && response.value.imageUrl != setFields.imageUrl))
        return res.status(422).send({errors: [{title: 'Product update failed. Please try again.', detail: err.message }]})
      
      return res.status(200).send(response.value);
    });
  });

});

router.delete('/', authJwt.verifyToken, (req, res) => {
  let id = req.body.id;
  mongo.getDb().collection('products').deleteOne({'_id': mongodb.ObjectId(id)}, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'Product delete failed. Please try again.', detail: err.message }]})
    }
    if (result.deletedCount == 0){
      return res.status(422).send({errors: [{title: 'Product delete failed. Please try again.', detail: "" }]})
    }
    return res.json({id: id});
  });
});

module.exports = router;
