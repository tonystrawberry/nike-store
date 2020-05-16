"use strict";

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var apiRoutes = require('./apiRoutes/index');

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use('/api', apiRoutes);
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../../client/build')));
app.get('/', function (req, res) {
  res.sendFile(_path["default"].join(__dirname, '../../client/build/index.html'));
});
app.get('/*', function (req, res) {
  res.redirect('/');
});
app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), function () {
  console.log("Listening on ".concat(app.get('port'), "..."));
});