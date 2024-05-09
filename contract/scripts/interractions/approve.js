const { ethers } = require("hardhat");
async function main() {
  const contractFactory = await ethers.getContractFactory("CoitonERC20");
  const contract = contractFactory.attach("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
  const ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  await (await contract.mintTo(ACCOUNT, 20e18.toString())).wait();
  // await (await contract.approve("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 20e18.toString())).wait();

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
