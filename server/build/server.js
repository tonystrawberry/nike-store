"use strict";

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// get reference to the client build directory
var staticFiles = _express["default"]["static"](_path["default"].join(__dirname, '../../client/build'));

var app = (0, _express["default"])();

var router = _express["default"].Router();

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(router);
app.use(staticFiles); // pass the static files (react app) to the express app. 

router.get('/api/ping', function (req, res) {
  res.send('pong');
});
app.use('/*', staticFiles);
app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), function () {
  console.log("Listening on ".concat(app.get('port'), "..."));
});