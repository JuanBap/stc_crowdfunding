require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20", // Incluye esta versión para las dependencias de OpenZeppelin
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Nodo local de Hardhat
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`, // Infura para Sepolia
      accounts: [`0x${process.env.PRIVATE_KEY_OWNER}`], // Clave privada
    },
  },
};
