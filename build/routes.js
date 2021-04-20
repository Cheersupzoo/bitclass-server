"use strict";

var _commonRoutes = require("./routes/commonRoutes/commonRoutes");

var _AuthRoutes = _interopRequireDefault(require("./routes/authRoutes/AuthRoutes"));

var _ClassRoutes = _interopRequireDefault(require("./routes/classRoutes/ClassRoutes"));

var _jwt = require("./services/jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const glob = require("glob");

module.exports = app => {
  var commonRoutes = new _commonRoutes.CommonRoutes();
  app.use("/", _AuthRoutes.default);
  app.use("/", _ClassRoutes.default);
  commonRoutes.route(app);
};