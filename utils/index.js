import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";

// Load .env variables
dotenvConfig();

// Provider + wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Forwarder contract
const forwarder = new ethers.Contract(
  process.env.FORWARDER_ADDRESS,
  [
    "function getNonce(address from) view returns (uint256)",
    "function execute((address from, address to, uint256 value, uint256 gas, uint256 nonce, bytes data) req, bytes signature)"
  ],
  wallet
);

// Token contract
const token = new ethers.Contract(
  process.env.TOKEN_ADDRESS,
  [
    "function transfer(address to, uint amount) returns (bool)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ],
  wallet
);

// Export contracts and wallet
export { forwarder, token, wallet };
