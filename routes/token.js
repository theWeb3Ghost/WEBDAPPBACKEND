import express from "express";
import { claimTokens, sendTokens,getBalance } from "../controllers/tokencontroller.js";
import verify from "../middleware/verifyGoogle.js";  // <-- FIXED (no require)

const router = express.Router();

router.post("/claim", verify, claimTokens);
router.post("/send", verify, sendTokens);
router.get("/balance/:address", getBalance);

export default router;   
