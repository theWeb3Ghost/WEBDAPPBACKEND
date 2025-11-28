import User from "../models/user.js";
import { createWallet } from "../utils/wallet.js"; // your token contract
import { token } from "../utils/index.js";
import genUser from "../utils/genUser.js";
import { ethers } from "ethers";

/**
 * Register a new user or update existing user info.
 * Automatically generates a username if not provided.
 */
export const registerUsername = async (req, res) => {
  try {
    const { uid, name } = req.body;

    if (!uid) return res.status(400).json({ error: "uid is required" });

    const username = genUser(name);

    let user = await User.findOne({ uid });

    if (!user) {
      const { address, privateKey } = createWallet();

      user = await User.create({
        uid,
        username,
        address,
        privateKey, // store securely
      });

      return res.json({
        message: "User registered",
        user: {
          uid: user.uid,
          username: user.username,
          address: user.address,
        },
      });
    } else {
      user.username = username;
      await user.save();

      return res.json({
        message: "Username updated",
        user: {
          uid: user.uid,
          username: user.username,
          address: user.address,
        },
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get user info including on-chain token balance
 */
export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ error: "uid required" });

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch ERC-20 balance in normal token units
    let balance = "0";
    try {
      const rawBalance = await token.balanceOf(user.address);
      const decimals = await token.decimals(); // token decimals, usually 18
      balance = ethers.formatUnits(rawBalance, decimals); // human-readable
    } catch (e) {
      console.error("Error fetching token balance:", e);
    }

    return res.json({
      uid: user.uid,
      username: user.username,
      address: user.address,
      balance, // string like "1.2345"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
