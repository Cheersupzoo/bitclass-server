import { Application, Request, Response, Router } from "express";
import { JWTService } from "../../services/jwt";
import { ClassController } from "./ClassController";

const router = Router();

const class_controller = new ClassController();

router.post(
  "/class",
  JWTService.requireJWTAuth,
  (req, res) => {
    class_controller.createClass(req, res);
  }
);

router.put(
  "/class/:id",
  JWTService.requireJWTAuth,
  (req, res) => {
    class_controller.updateClass(req, res);
  }
);

router.delete(
  "/class/:id",
  JWTService.requireJWTAuth,
  (req, res) => {
    class_controller.deleteClass(req, res);
  }
);

// router.get("/class", (req, res) => {
//   class_controller.getClass(req, res);
// });

router.get("/class/:id", (req, res) => {
  class_controller.getClassById(req, res);
});

export default router;
