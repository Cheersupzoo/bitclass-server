"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JWTService = void 0;

var _express = require("express");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const JwtStrategy = require("passport-jwt").Strategy;

const ExtractJwt = require("passport-jwt").ExtractJwt;

const SECRET = "BC2021-ATRCB-ASDDASDASDASDNX0.ASD12eSDASD2312asdAS";

const jwt = require("jsonwebtoken");

const passport = require("passport"); //สร้าง Strategy


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  console.log(payload);
  done(null, true); //   if (payload.sub === "1234") done(null, true);
  //   else done(null, false);
}); //เสียบ Strategy เข้า Passport

passport.use(jwtAuth);

class JWTService {
  //ทำ Passport Middleware
  static encodeJWT(uid) {
    const payload = {
      uid: uid,
      iat: new Date().getTime()
    };
    return jwt.sign(payload, SECRET, {
      expiresIn: "30m"
    });
  }

  static decodeJWT(token) {
    return jwt.verify(token.replace("bearer ", ""), SECRET);
  }

  static getUIDFromJWT(req) {
    return jwt.verify(req.headers.authorization.replace("bearer ", ""), SECRET);
  }

}

exports.JWTService = JWTService;

_defineProperty(JWTService, "requireJWTAuth", passport.authenticate("jwt", {
  session: false
}));