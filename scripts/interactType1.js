//interactType1.js
require("dotenv").config();
const { ethers, parseUnits, formatUnits } = require("ethers");
const fs = require("fs");

async function main() {
  const deploymentData = JSON.parse(fs.readFileSync("./deployments_sepolia.json"));

  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
  const investor1PrivateKey = process.env.PRIVATE_KEY_INVESTOR1;
  const investor1 = new ethers.Wallet(investor1PrivateKey, provider);

  const crowdfundingAbi = JSON.parse(fs.readFileSync("./artifacts/contracts/Crowdfunding.sol/Crowdfunding.json")).abi;

  const crowdfunding = new ethers.Contract(deploymentData.crowdfunding, crowdfundingAbi, investor1);

  console.log("Investor 1 investing as Type 1...");
  const investmentAmount = parseUnits("0.1", 18);

  const tx = await crowdfunding.invest(1, investmentAmount, "");
  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("Transaction confirmed:", receipt.transactionHash);

  // Check token balance after investment
  const tokenAbi = JSON.parse(fs.readFileSync("./artifacts/contracts/Token.sol/Token.json")).abi;
  const token = new ethers.Contract(deploymentData.token, tokenAbi, investor1);
  const balance = await token.balanceOf(investor1.address);
  console.log("Token balance after investment:", formatUnits(balance, 18));
}

main().catch((error) => {
  console.error("Error interacting with contracts:", error);
  process.exitCode = 1;
});