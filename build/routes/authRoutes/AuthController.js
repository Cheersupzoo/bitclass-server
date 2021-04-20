"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthController = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _firebase = require("../../services/firebase");

var admin = _interopRequireWildcard(require("firebase-admin"));

var _jwt = require("../../services/jwt");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const reqResponse = require("../../cors/responseHandler");

const {
  validationResult
} = require("express-validator");

const log = console.log;

class AuthController {
  constructor() {
    _defineProperty(this, "firebaseService", _firebase.FirebaseService.firebaseService);

    _defineProperty(this, "firebase_user", this.firebaseService.firestore.collection("users"));
  }

  // async signin(req, res) {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(402).send(reqResponse.errorResponse(402));
  //   }
  //   let data = req.body;
  //   console.log(chalk.blue(`${JSON.stringify(data)}`));
  //   let type = data.type;
  //   let user = {};
  //   switch (type) {
  //     case "google":
  //       // console.log(chalk.blue(`${data.type}`));
  //       let token = req.body.token.replace("Bearer ", "");
  //       try {
  //         const decodedToken = await admin.auth().verifyIdToken(token);
  //         // console.log(chalk.blue("decodedToken", JSON.stringify(decodedToken)));
  //         if (data.email === decodedToken.email) {
  //           user.email = data.email;
  //           user.googleID = decodedToken.uid;
  //           console.log(chalk.blue("decodedToken", JSON.stringify(user)));
  //           user.createdTime = new Date();
  //           var isUserExist = await this.firebase_user
  //             .where("googleID", "==", user.googleID)
  //             .get();
  //           if (isUserExist.empty) {
  //             return res
  //               .status(200)
  //               .send(
  //                 reqResponse.successResponse(
  //                   500,
  //                   "Signin fail: User not exist"
  //                 )
  //               );
  //           } else {
  //             let uid = isUserExist.docs[0].id;
  //             var auth = `bearer ${JWTService.encodeJWT(uid)}`;
  //             res.status(200).send(
  //               reqResponse.successResponse(200, "Signin success", {
  //                 Authorization: auth,
  //               })
  //             );
  //             return;
  //           }
  //         } else {
  //           res
  //             .status(502)
  //             .send(
  //               reqResponse.successResponse(500, "Error", "Token not match")
  //             );
  //           return;
  //         }
  //       } catch (error) {
  //         res.status(502).send(reqResponse.errorResponse(502, "Error", error));
  //         console.log(chalk.red(`${JSON.stringify(error)}`));
  //         return;
  //       }
  //       res.status(200).send(reqResponse.successResponse(200, "User Created"));
  //       //   .send(reqResponse.successResponse(200, "User Created", save_deck.id));
  //       break;
  //     default:
  //       res.status(502).send(reqResponse.errorResponse(502));
  //       return;
  //   }
  // }
  async signup(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(402).send(reqResponse.errorResponse(402));
    }

    let data = req.body; // console.log(chalk.blue(`${JSON.stringify(data)}`));

    let type = data.type;
    let user = {};

    switch (type) {
      case "google":
        // console.log(chalk.blue(`${data.type}`));
        let token = req.body.token.replace("Bearer ", "");

        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          console.log(_chalk.default.blue("decodedToken", JSON.stringify(decodedToken)));

          if (data.email === decodedToken.email && data.name == decodedToken.name) {
            user.google = true;
            user.email = data.email;
            user.name = data.name;
            user.role = "user";
            user.googleID = decodedToken.uid;
            console.log(_chalk.default.blue("decodedToken", JSON.stringify(user)));
            user.createdTime = new Date();
            var isUserExist = await this.firebase_user.where("googleID", "==", user.googleID).get();
            console.log(isUserExist.empty);

            if (isUserExist.empty) {
              var save_user = await this.firebase_user.add(user);
              save_user.update({
                id: save_user.id
              });
              var auth = `bearer ${_jwt.JWTService.encodeJWT(save_user.id)}`;
              return res.status(200).send(reqResponse.successResponse(200, "Create User success", {
                Authorization: auth
              }));
            } else {
              let uid = isUserExist.docs[0].id;
              var auth = `bearer ${_jwt.JWTService.encodeJWT(uid)}`;
              return res.status(200).send(reqResponse.successResponse(200, "Signin success", {
                Authorization: auth
              }));
            }
          } else {
            res.status(502).send(reqResponse.successResponse(500, "Error", "Token not match"));
            return;
          } //   .send(reqResponse.successResponse(200, "User Created", save_deck.id));

        } catch (error) {
          res.status(502).send(reqResponse.errorResponse(502, "Error", error));
          console.log(_chalk.default.red(`${JSON.stringify(error)}`));
          console.log(_chalk.default.red(error));
          return;
        }

        break;

      default:
        res.status(502).send(reqResponse.errorResponse(502));
        return;
    }
  }

  async getUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(402).send(reqResponse.errorResponse(402));
    }

    let jwt = _jwt.JWTService.getUIDFromJWT(req);

    var user = await this.firebase_user.doc(jwt.uid).get();
    let user_data = user.data();
    console.log(user_data);
    return res.status(200).send(reqResponse.successResponse(200, "Signin success", user_data));
  }

  async getUserById(req, res) {
    const errors = validationResult(req);
    let id = req.params.id.trim();

    if (!errors.isEmpty()) {
      return res.status(402).send(reqResponse.errorResponse(402));
    }

    let jwt = _jwt.JWTService.getUIDFromJWT(req);

    var user = await this.firebase_user.doc(id).get();
    let user_data = user.data();
    console.log(user_data);
    return res.status(200).send(reqResponse.successResponse(200, "Signin success", user_data));
  }

}

exports.AuthController = AuthController;