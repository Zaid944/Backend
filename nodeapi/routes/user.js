import express from "express";
import {
  register,
  getMyProfile,
  login,
  logout
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me",isAuthenticated, getMyProfile);

router.get("/logout", logout)

router.post("/new", register);

router.post("/login", login);


export default router;

// router.put("/userId/:id", updateUserById);
// router.get("/userId/special", specialUser);
// router.route("/userId/:id").get(getUserById).put(updateUserById);