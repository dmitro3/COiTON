const { ethers } = require("hardhat");
async function main() {
  const contractFactory = await ethers.getContractFactory("APIConsumer");
  const contract = contractFactory.attach("0x168cE3dA1336f8909849563ba768c891bDA52F5B");
  const ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  await (await contract.requestVolumeData()).wait();
  // await (await contract.approve("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 20e18.toString())).wait();

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
