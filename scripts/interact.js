const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Sustituir con la dirección del contrato Token
  const crowdfundingAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Sustituir con la dirección del contrato Crowdfunding

  // Obtener cuentas
  const [owner, investor1, investor2] = await hre.ethers.getSigners();

  // Conectar contratos
  console.log("Conectando con el contrato Token...");
  const token = await hre.ethers.getContractAt("Token", tokenAddress);

  console.log("Conectando con el contrato Crowdfunding...");
  const crowdfunding = await hre.ethers.getContractAt("Crowdfunding", crowdfundingAddress);

  // Transferir tokens a los inversores
  console.log("Transfiriendo tokens a los inversores...");
  const transferAmount = hre.ethers.parseUnits("1000", 18); // Convertir a BigInt
  await token.transfer(investor1.address, transferAmount);
  await token.transfer(investor2.address, transferAmount);
  console.log("Tokens transferidos.");

  // Transferir tokens al contrato Crowdfunding
  console.log("Transfiriendo tokens al contrato Crowdfunding...");
  const crowdfundingInitialBalance = hre.ethers.parseUnits("5000", 18); // Cantidad inicial para Crowdfunding
  await token.transfer(crowdfundingAddress, crowdfundingInitialBalance);
  console.log("Tokens transferidos al contrato Crowdfunding.");

  // Aprobar tokens para el contrato Crowdfunding
  console.log("Aprobando tokens para Crowdfunding...");
  await token.connect(investor1).approve(crowdfundingAddress, transferAmount);
  await token.connect(investor2).approve(crowdfundingAddress, transferAmount / 2n); // Usar BigInt para dividir
  console.log("Tokens aprobados.");

  // Investor 1 (Tipo 1)
  console.log("Investor 1 invirtiendo como Tipo 1...");
  await crowdfunding
    .connect(investor1)
    .invest(1, hre.ethers.parseUnits("100", 18), ""); // Sin NFT URI
  console.log("Investor 1 completó la inversión.");

  // Investor 2 (Tipo 2)
  console.log("Investor 2 invirtiendo como Tipo 2...");
  await crowdfunding
    .connect(investor2)
    .invest(2, hre.ethers.parseUnits("50", 18), "ipfs:/QmbP6D7RUBfPa5aYmZx1P9tMC9hGtkB35rvr214w8iV3UF"); // Reemplaza con tu URI de NFT
  console.log("Investor 2 completó la inversión.");

  // Verificar balances
  console.log("Verificando balances...");
  const balanceInvestor1 = await token.balanceOf(investor1.address);
  const balanceInvestor2 = await token.balanceOf(investor2.address);
  const crowdfundingBalance = await token.balanceOf(crowdfundingAddress);

  console.log("Balance de Investor 1:", balanceInvestor1.toString());
  console.log("Balance de Investor 2:", balanceInvestor2.toString());
  console.log("Balance del Contrato Crowdfunding:", crowdfundingBalance.toString());
}

// Ejecutar el script
main().catch((error) => {
  console.error("Error interacting with contracts:", error);
  process.exitCode = 1;
});
