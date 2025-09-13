// scripts/deploy_donationbox.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("DonationBox");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("DonationBox deployed to:", addr);

  // Для верификации (если установлен ETHERSCAN_API_KEY и сеть поддерживается)
  if (hre.network.name !== "hardhat" && process.env.ETHERSCAN_API_KEY) {
    // Небольшая пауза чтобы дождаться индексации
    console.log("Waiting for block confirmations before verification...");
    await contract.deploymentTransaction().wait(5);
    try {
      await hre.run("verify:verify", {
        address: addr,
        constructorArguments: [],
      });
      console.log("Verified!");
    } catch (e) {
      console.log("Verification skipped or failed:", e.message || e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
