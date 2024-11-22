const hre = require("hardhat");

async function main() {
  // Deploy Token Contract
  console.log("Deploying Token Contract...");
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(); // Desplegar contrato
  await token.waitForDeployment(); // Esperar hasta que el despliegue esté completo
  const tokenAddress = await token.getAddress(); // Obtener dirección del contrato
  console.log("Token Contract deployed at:", tokenAddress);

  // Deploy Crowdfunding Contract
  console.log("Deploying Crowdfunding Contract...");
  const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy(tokenAddress); // Desplegar contrato
  await crowdfunding.waitForDeployment(); // Esperar hasta que el despliegue esté completo
  const crowdfundingAddress = await crowdfunding.getAddress(); // Obtener dirección del contrato
  console.log("Crowdfunding Contract deployed at:", crowdfundingAddress);
}

// Ejecutar el script
main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
