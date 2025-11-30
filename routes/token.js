import express from "express";
import { claim, send,getBalance } from "../controllers/tokencontroller.js";
import verify from "../middleware/verifyGoogle.js";  // <-- FIXED (no require)

const router = express.Router();

router.post("/claim", verify, claim);
router.post("/send", verify, send);
router.get("/balance/:address", getBalance);

export default router;   
