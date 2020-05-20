import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import authJwt from '../../middlewares/authJwt'

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

/***** USER API */

router.get('/users/:id', (req, res) => {
  let id = req.params.id;
  mongo.getDb().collection('users').findOne({'_id:': id}, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'User fetch failed. Please try again.', detail: err.message }]})
    }
    return res.json(result);
  })
});

router.post('/users', (req, res) => {
  let users = req.body;
  mongo.getDb().collection('users').insertMany(users, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'User add failed. Please try again.', detail: err.message }]})
    }
    console.log("MONGO LOG - User added", users);
    return res.json(users);
  });
});

router.put('/users/:id', (req, res) => {
  let id = req.params.id;
  let user = req.body;
  mongo.getDb().collection('users').updateOne({'_id': id}, user, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'User update failed. Please try again.', detail: err.message }]})
    }
    console.log("MONGO LOG - User updated", user);
    return res.json(user);
  });
});

/***** AUTH API */

let BCRYPT_SALT_ROUNDS = 12;
router.post('/register', function(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    .then(function(hashedPassword) {
      mongo.getDb().collection('users').insertOne({email: email, password: hashedPassword}, (err, user) => {
        if (err) {
          return res.status(422).send({errors: [{title: 'User registration failed. Please try again.', detail: err.message }]})
        }
        return res.json(user);
      });
    })
    .catch(function(error){
      return res.status(500).send({errors: [{title: 'User registration failed. Please try again.', detail: err.message }]})
    });
})


router.post('/login', function(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  mongo.getDb().collection('users').findOne({'email': email}, (err, user) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'User does not exist. Please register.', detail: err.message }]})
    }
    
    if (!user) {
      return res.status(422).send({errors: [{title: 'User does not exist. Please register.'}]})
    }

    bcrypt.compare(password, user.password).then((same) => {
      if (!same){
        return res.status(403).send({errors: [{title: 'Wrong credentials. Please try again.'}]})
      }

      let token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      return res.status(200).send({email: email, accessToken: token});
    })
  })
})

module.exports = router;
