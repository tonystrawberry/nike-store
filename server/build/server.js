"use strict";

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var router = _express["default"].Router();

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(router);
router.get('/api/ping', function (req, res) {
  res.send('pong');
});
app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), function () {
  console.log("Listening on ".concat(app.get('port'), "..."));
});