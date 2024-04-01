require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const { validator } = require("web3-validator");

const etherRouter = express.Router();

if (!process.env.INFURA_URL) {
  console.error({
    message: "No Infura URL supplied to initialize web3",
  });
}

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

/**
 * @openapi
 * /balance/{account}:
 *   get:
 *     summary: Get Ethereum balance
 *     tags: [Ethereum]
 *     parameters:
 *       - in: path
 *         name: account
 *         required: true
 *         schema:
 *           type: string
 *         description: The Ethereum account address.
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 account:
 *                   type: string
 *                   example: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
 *                 balance:
 *                   type: string
 *                   example: 40.465178859400500432
 *       400:
 *         description: Invalid Ethereum address
 *       500:
 *         description: An unexpected error occurred
 */

etherRouter.get("/balance/:account", async (req, res) => {
  try {
    const { account } = req.params;
    // Validate Ethereum address using web3-validator
    const errors = validator.validate(["address"], [account], { silent: true });
    if (errors) {
      return res.status(400).send("Invalid Ethereum address");
    }

    const balance = await web3.eth.getBalance(account);
    const balanceInEther = web3.utils.fromWei(balance, "ether");

    res.send({ account, balance: balanceInEther });
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error occurred");
  }
});

module.exports = { etherRouter };
