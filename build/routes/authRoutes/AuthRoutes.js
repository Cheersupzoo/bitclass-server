"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _AuthController = require("./AuthController");

var _jwt = require("../../services/jwt");

const router = (0, _express.Router)();
const auth_controller = new _AuthController.AuthController();
router.post("/auth/signin", (req, res) => {
  auth_controller.signin(req, res);
});
router.post("/auth/signup", (req, res) => {
  auth_controller.signup(req, res);
});
router.get("/auth/user", _jwt.JWTService.requireJWTAuth, (req, res) => {
  auth_controller.getUser(req, res);
});
var _default = router;
exports.default = _default;