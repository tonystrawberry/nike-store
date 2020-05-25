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

const checkDuplicateUsernameOrEmailOnUpdate = async (req, res, next) => {
  let user = req.body.user;
  if (user.username == null && user.email == null){
    next();
    return;
  }
  if (user.username != null){
    let promise = () => {
      return new Promise((resolve, reject) => {
        mongo.getDb().collection('users').findOne({
          username: user.username
        }).then((user) => { resolve(user) });
      });
    };

    
    let result = await promise();
    if (result) {
      res.status(400).send({errors: [{ title: 'Username is already in use.', detail: '' }] });
      return;
    }
  }

  if (user.email != null){
    let promise = () => {
      return new Promise((resolve, reject) => {
        mongo.getDb().collection('users').findOne({
          email: user.email
        }).then((user) => { resolve(user) });
      });
    };

    let result = await promise();
    if (result) {
      res.status(400).send({errors: [{ title: 'Email is already in use.', detail: '' }] });
      return;
    }
  }

  next();
}


module.exports = { checkDuplicateUsernameOrEmail, checkDuplicateUsernameOrEmailOnUpdate }