import express from 'express';

var router = express.Router();

router.use('/ping', (req, res) => {
  console.log("[GET] /api/ping ...");
  res.send("pong");
}); 

module.exports = router;
