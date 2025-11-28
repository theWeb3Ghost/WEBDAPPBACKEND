import { forwarder, token, wallet } from "../utils/index.js";

/**
 * Relay a gasless ERC20 transfer using MinimalForwarder on Sepolia
 * @param {string} from - Sender address
 * @param {string} to - Recipient address
 * @param {BigNumber} amount - Amount to send (ethers.parseUnits)
 */
export async function relayMetaTransfer(to, amount, from) {
  try {
    // Encode the ERC20 transfer function
    const data = token.interface.encodeFunctionData("transfer", [to, amount]);

    // Get the sender nonce from the forwarder
    const nonce = await forwarder.getNonce(from);

    // Estimate gas for this call
    const estimatedGas = await token.connect(wallet).estimateGas.transfer(to, amount);
    const gasLimit = estimatedGas.toNumber() * 2; // add safety margin

    const request = {
      from,
      to: token.address,
      value: 0,
      gas: gasLimit,       // dynamically set
      nonce: nonce.toNumber(),
      data,
    };

    // EIP-712 domain
    const domain = {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId: 11155111,          // Sepolia
      verifyingContract: forwarder.address,
    };

    const types = {
      ForwardRequest: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "gas", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "data", type: "bytes" },
      ],
    };

    // Sign with relayer wallet
    const signature = await wallet._signTypedData(domain, types, request);

    // Execute the meta-transaction
    const tx = await forwarder.execute(request, signature);
    console.log("Meta-tx sent! Tx hash:", tx.hash);

    return tx;
  } catch (err) {
    console.error("Failed to relay meta transaction:", err);
    throw err;
  }
}