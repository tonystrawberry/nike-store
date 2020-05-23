const mongo = require('../db/mongodb');

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  mongo.getDb().collection('users').findOne({
    username: req.body.username
  }).then(user => {
    if (user) {
      res.status(400).send({errors: [{ title: 'Username is already in use.', detail: '' }] });
      return;
    }

    mongo.getDb().collection('users').findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        res.status(400).send({errors: [{ title: 'Email is already in use.', detail: '' }] })
        return;
      }

      next();
    });
  });
};

module.exports = { checkDuplicateUsernameOrEmail }