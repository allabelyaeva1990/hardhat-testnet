module.exports = {
  solidity: {
    version: "0.8.28",   // <-- версия, которая у тебя в контрактах
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      // Встроенная сеть Hardhat
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Адрес вашей локальной ноды
    },
  },
};