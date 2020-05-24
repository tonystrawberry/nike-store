import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { checkDuplicateUsernameOrEmail } from '../../middlewares/verifyId';
import mongodb from 'mongodb';

const router = express.Router();

const mongo = require('../../db/mongodb');
const upload = require('../../services/image-upload');

const singleUpload = upload.single('image');

router.get('/ping', (req, res) => {
  res.send("pong");
});

/***** USER API */

router.get('/:id', (req, res) => {
  let id = req.params.id;
  mongo.getDb().collection('users').findOne({'_id': mongodb.ObjectId(id)}, (err, user) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'User fetch failed. Please try again.', detail: err.message }]})
    }
    return res.json(user);
  })
});

router.post('/', (req, res) => {
  let users = req.body;
  mongo.getDb().collection('users').insertMany(users, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'User add failed. Please try again.', detail: err.message }]})
    }
    return res.json(users);
  });
});

router.put('/', checkDuplicateUsernameOrEmail, (req, res) => {
  let user = req.body.user;
  let fields = {
    $set: { fullName: user.fullName, username: user.username, email: user.email }
  }
  mongo.getDb().collection('users').updateOne({'_id': mongodb.ObjectId(user.id)}, fields, (err, result) => {
    if (err) {
      return res.status(422).send({errors: [{title: 'User update failed. Please try again.', detail: err.message }]})
    }
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
    return res.status(200).send({id: user.id, username: user.username, email: user.email, accessToken: token});
  });
});

module.exports = router;
