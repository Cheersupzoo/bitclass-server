import { Router } from "express";
import { AuthController } from "./AuthController";
import { JWTService } from "../../services/jwt";

const router = Router();

const auth_controller = new AuthController();

router.post("/auth/signin", (req, res) => {
  auth_controller.signin(req, res);
});

router.post("/auth/signup", (req, res) => {
  auth_controller.signup(req, res);
});

router.get("/auth/user", JWTService.requireJWTAuth, (req, res) => {
  auth_controller.getUser(req, res);
});
export default router;
