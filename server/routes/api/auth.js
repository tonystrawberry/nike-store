import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { checkDuplicateUsernameOrEmail } from '../../middlewares/verifyId';

const router = express.Router();

const mongo = require('../../db/mongodb');

router.get('/ping', (req, res) => {
  res.send("pong");
});

/***** AUTH API */

let BCRYPT_SALT_ROUNDS = 12;
router.post('/register', checkDuplicateUsernameOrEmail, function(req, res) {
  let fullName = req.body.fullName;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    .then(function(hashedPassword) {
      mongo.getDb().collection('users').insertOne({fullName: fullName, username: username, email: email, password: hashedPassword}, (err, response) => {
        if (err) {
          return res.status(422).send({errors: [{title: 'User registration failed. Please try again.', detail: err.message }]})
        }
        let user = response.ops[0];
        let token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });

        return res.status(200).send({id: user._id, username: user.username, email: user.email, accessToken: token});
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

      return res.status(200).send({id: user._id, username: user.username, email: user.email, accessToken: token});
    })
  })
})

module.exports = router;
