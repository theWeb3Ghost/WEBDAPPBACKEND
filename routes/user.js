import express from "express";
import { registerUsername, getUser } from "../controllers/usercontroller.js";
import verify from "../middleware/verifyGoogle.js";

const router = express.Router();

router.post("/register", verify, registerUsername);
router.get("/:uid", verify, getUser); // use :uid instead of /me

export default router;


