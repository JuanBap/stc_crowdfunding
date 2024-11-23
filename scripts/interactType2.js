//interactType2.js
require("dotenv").config();
const { ethers, parseUnits, formatUnits } = require("ethers");
const fs = require("fs");

async function main() {
  const deploymentData = JSON.parse(fs.readFileSync("./deployments_sepolia.json"));

  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
  const investor2PrivateKey = process.env.PRIVATE_KEY_INVESTOR2;
  const investor2 = new ethers.Wallet(investor2PrivateKey, provider);

  const crowdfundingAbi = JSON.parse(fs.readFileSync("./artifacts/contracts/Crowdfunding.sol/Crowdfunding.json")).abi;

  const crowdfunding = new ethers.Contract(deploymentData.crowdfunding, crowdfundingAbi, investor2);

  console.log("Investor 2 investing as Type 2...");
  // Cambiar Uri
  const nftUri = "ipfs://QmbP6D7RUBfPa5aYmZx1P9tMC9hGtkB35rvr214w8iV3UF";
  const investmentAmount = parseUnits("0.1", 18);

  const tx = await crowdfunding.invest(2, investmentAmount, nftUri);
  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("Transaction confirmed:", receipt.transactionHash);

  const nftCounter = await crowdfunding.nftCounter();
  console.log("NFT minted with tokenId:", nftCounter.toString());
}

main().catch((error) => {
  console.error("Error interacting with contracts:", error);
  process.exitCode = 1;
});
