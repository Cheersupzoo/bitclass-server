import chalk from "chalk";
import { FirebaseService } from "../../services/firebase";
import { JWTService } from "../../services/jwt";
const { nanoid } = require("nanoid");

const reqResponse = require("../../cors/responseHandler");
const { validationResult } = require("express-validator");
const log = console.log;

export class ClassController {
  firebaseService = FirebaseService.firebaseService;
  firebase_classes = this.firebaseService.firestore.collection("classes");
  firebase_users = this.firebaseService.firestore.collection("users");
  bucket = this.firebaseService.bucket;
  async createClass(req, res) {
    let jwt = JWTService.getUIDFromJWT(req);
    var user = this.firebase_users.doc(jwt.uid);
    // if (user.data().role != "admin") {
    //   return res.status(402).send(reqResponse.errorResponse(402));
    // }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).send(reqResponse.errorResponse(402));
    }
    // console.log(chalk.blue(`${JSON.stringify(req.body)}`))
    var body = req.body;
    var classroom = {};
    classroom.cid = nanoid(8);
    classroom.name = body.name;
    classroom.code = body.code;
    classroom.section = body.section;
    classroom.createdTime = new Date();
    classroom.lastEditTime = new Date();
    classroom.owner = jwt.uid;
    classroom.student = [];
    var save_class = await this.firebase_classes.doc(classroom.cid);
    save_class.create(classroom);

    let user_data = await user.get();
    let user_classes = user_data.data().classes;
    if (!user_classes) {
      user_classes = [classroom.cid];
    } else {
      user_classes.push(classroom.cid);
    }

    await user.update({
      classes: user_classes,
    });
    try {
      log(chalk.blue.bgGreenBright.bold("createClass!"));
      res
        .status(200)
        .send(reqResponse.successResponse(200, "Class Created", save_class.id));
    } catch (error) {
      console.error(error);
      res.status(502).send(reqResponse.errorResponse(502));
    }
  }

  async updateClass(req, res) {
    let jwt = JWTService.getUIDFromJWT(req);
    var user = await this.firebase_users.doc(jwt.uid).get();

    const errors = validationResult(req);
    var class_fb = this.firebase_classes.doc(req.params.id.trim());
    var classroom = (await class_fb.get()).data();
    let data = req.body;
    classroom.code = data["code"] || classroom.code;
    classroom.name = data["name"] || classroom.name;
    classroom.section = data["section"] || classroom.section;
    classroom.lastEditTime = new Date();
    await class_fb.update(classroom);
    log(chalk.blue.bgGreenBright.bold("updateClass!"));
    if (!errors.isEmpty()) {
      return res.status(402).send(reqResponse.errorResponse(402));
    }
    return res
      .status(200)
      .send(
        reqResponse.successResponse(200, "updateClass", req.params.id.trim())
      );
  }

  //  async getClass(req, res) {
  //   var classs = this.firebase_classes;
  //   var doc = await classs.get();

  //   if (doc.empty) {
  //     console.log("No such document!");
  //   } else {
  //     console.log("Document data:");
  //     var docs = doc.docs.map((e) => {
  //       console.log(`${e.id} ${e.get("title")}`);
  //       return plainToClass(Class, e.data());
  //     });
  //     return res
  //       .status(200)
  //       .send(reqResponse.successResponse(200, "success", docs));
  //   }
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(402).send(reqResponse.errorResponse(402));
  //   }
  //   log(chalk.blue.bgGreenBright.bold("getClass!"));
  //   return res.status(200).send(reqResponse.successResponse(200, "getClass"));
  // }

  async getClassById(req, res) {
    log(chalk.blue.bgGreenBright.bold("getClass!"));
    console.log(req.params.id.trim());
    var classs = this.firebase_classes.doc(req.params.id.trim());
    var doc = await classs.get();
    if (!doc.exists) {
      console.log("No such document!");
      return res
        .status(200)
        .send(reqResponse.successResponse(200, "getClass", "Class not exist"));
    } else {
      console.log("Document data:");
      console.log(`${doc.id} ${doc.get("name")}`);
      let classroom = doc.data();

      return res
        .status(200)
        .send(reqResponse.successResponse(200, "success", classroom));
    }
  }

  async deleteClass(req, res) {
    let jwt = JWTService.getUIDFromJWT(req);

    var cid = req.params.id.trim();
    var classs = this.firebase_classes.doc(req.params.id.trim());

    var classes_data = (await classs.get()).data();

    var sid = classes_data.owner;
    var user = this.firebase_users.doc(sid);
    var user_data = (await user.get()).data();
    var user_classes = user_data.classes.filter((any_id) => any_id != cid);
    user.update({
      classes: user_classes,
    });

    if (classes_data.student) {
      await Promise.all(
        classes_data.student.map(async (sid) => {
          var user = this.firebase_users.doc(sid);
          var user_data = (await user.get()).data();
          var user_classes = user_data.classes.filter((any_id) => any_id != cid);
          user.update({
            classes: user_classes,
          });
        })
      );
    }

    await classs.delete();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).send(reqResponse.errorResponse(402));
    }

    log(chalk.blue.bgGreenBright.bold("deleteClass!"));
    return res
      .status(200)
      .send(
        reqResponse.successResponse(
          200,
          "deleteClass success",
          req.params.id.trim()
        )
      );
  }
}
