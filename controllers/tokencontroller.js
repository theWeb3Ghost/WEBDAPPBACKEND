import User from "../models/user.js";
import { ethers } from "ethers";
import { token } from "../utils/index.js"; 
import { relayMetaTransfer } from "../relayer/forwarderHelper.js";

// -------------------- Claim Tokens --------------------
export const claim = async (req, res) => {
  console.log("Claim endpoint hit by UID:", req.user?.uid);
  try {
    const uid = req.user.uid;
    const user = await User.findOne({ uid });

    if (!user) {
      console.log("User not found for UID:", uid);
      return res.status(404).send("User not found");
    }

    console.log("user.claimed:", user.claimed);

    const now = new Date();
    const currentHour = now.getHours();
    console.log("currentHour:", currentHour);

    const hoursPassed = currentHour - 11;
    const amountTokens = 100 - hoursPassed * 20;
    console.log("amountTokens:", amountTokens);

    if (user.claimed) return res.status(400).send("Already claimed");
    if (currentHour < 11 || currentHour >= 15) return res.status(400).send("Claim is only allowed between 11 AM and 3 PM");
    if (amountTokens <= 0) return res.status(400).send("Claim amount is 0, too late to claim");

    const amount = ethers.parseUnits(amountTokens.toString(), 18);

    const tx = await token.transfer(user.address, amount);
    await tx.wait();

    user.claimed = true;
    await user.save();

    res.send(`Claimed ${amountTokens} tokens successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

// -------------------- Send Tokens via Relayer --------------------
export const send = async (req, res) => {
  try {
    const { toUsername, amount } = req.body;

    if (!toUsername || !amount) return res.status(400).send("Missing fields");

    const fromUser = await User.findOne({ uid: req.user.uid });
    const toUser = await User.findOne({ username: toUsername });

    if (!fromUser) return res.status(404).send("Sender not found");
    if (!toUser) return res.status(404).send("Recipient not found");
    if (fromUser.uid === toUser.uid) return res.status(400).send("Cannot send to yourself");

    const txAmount = ethers.parseUnits(amount.toString(), 18);

    // Use relayer helper (should call forwarder internally)
    const tx = await relayMetaTransfer(toUser.address, txAmount, fromUser.address);
    await tx.wait();

    res.send(`Sent ${amount} tokens to ${toUsername} successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Transaction failed");
  }
};

// -------------------- Get Token Balance --------------------
export const getBalance = async (req, res) => {
  try {
    const bal = await token.balanceOf(req.params.address);
    res.json({ balance: bal.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch balance");
  }
};
