import { Request, Response } from "express";

const JwtStrategy = require("passport-jwt").Strategy;

const ExtractJwt = require("passport-jwt").ExtractJwt;

const SECRET = "BC2021-ATRCB-ASDDASDASDASDNX0.ASD12eSDASD2312asdAS";

const jwt = require("jsonwebtoken");

const passport = require("passport");

//สร้าง Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  console.log(payload);
  done(null, true);
  //   if (payload.sub === "1234") done(null, true);
  //   else done(null, false);
});
//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);

export class JWTService {
  //ทำ Passport Middleware
  static requireJWTAuth = passport.authenticate("jwt", { session: false });

  static encodeJWT(uid) {
    const payload = {
      uid: uid,
      iat: new Date().getTime(),
    };
    return jwt.sign(payload, SECRET, { expiresIn: "30m" });
  }

  static decodeJWT(token) {
    return jwt.verify(token.replace("bearer ", ""), SECRET);
  }

  static getUIDFromJWT(req) {
    
    return jwt.verify((req.headers.authorization).replace("bearer ", ""), SECRET);
  }

}
