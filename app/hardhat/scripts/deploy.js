const hre = require("hardhat");

async function main() {
  console.log("Blue Wing Worker A: Initializing deployment...");

  const Bridge = await hre.ethers.getContractFactory("BlueWingBridge");
  const bridge = await Bridge.deploy();

  await bridge.waitForDeployment();

  console.log(
    `Blue Wing Bridge deployed to: ${await bridge.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
