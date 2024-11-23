require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Token Contract
  console.log("Deploying Token Contract...");
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.waitForDeployment(); // Usar el método correcto para esperar el despliegue
  console.log("Token deployed at:", token.target); // token.target es la dirección en ethers.js v6+

  // Deploy Crowdfunding Contract
  console.log("Deploying Crowdfunding Contract...");
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy(token.target);
  await crowdfunding.waitForDeployment(); // Usar el método correcto para esperar el despliegue
  console.log("Crowdfunding deployed at:", crowdfunding.target);

  // Authorize Crowdfunding Contract in Token Contract
  console.log("Authorizing Crowdfunding Contract...");
  const tx = await token.setCrowdfundingContract(crowdfunding.target);
  await tx.wait();
  console.log("Crowdfunding Contract authorized in Token Contract.");

  // Save deployment data to JSON
  const deploymentData = {
    token: token.target,
    crowdfunding: crowdfunding.target,
  };

  fs.writeFileSync("./deployments_sepolia.json", JSON.stringify(deploymentData, null, 2));
  console.log("Deployment data saved to deployments_sepolia.json");
}

main().catch((error) => {
  console.error("Error deploying contracts:", error);
  process.exitCode = 1;
});
