const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({errors: [{title: 'No token provided. Please login.'}]});
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({errors: [{title: 'Unauthorized access. Please login.'}]});
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken
}

module.exports = authJwt;