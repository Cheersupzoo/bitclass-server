"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _jwt = require("../../services/jwt");

var _ClassController = require("./ClassController");

const router = (0, _express.Router)();
const class_controller = new _ClassController.ClassController();
router.post("/class", _jwt.JWTService.requireJWTAuth, (req, res) => {
  class_controller.createClass(req, res);
});
router.post("/class/:id/addstudent", _jwt.JWTService.requireJWTAuth, (req, res) => {
  class_controller.addStudentToClass(req, res);
});
router.put("/class/:id", _jwt.JWTService.requireJWTAuth, (req, res) => {
  class_controller.updateClass(req, res);
});
router.delete("/class/:id", _jwt.JWTService.requireJWTAuth, (req, res) => {
  class_controller.deleteClass(req, res);
}); // router.get("/class", (req, res) => {
//   class_controller.getClass(req, res);
// });

router.get("/class/:id", (req, res) => {
  class_controller.getClassById(req, res);
});
var _default = router;
exports.default = _default;