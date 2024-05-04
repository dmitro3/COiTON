const { ethers } = require("hardhat");
async function main() {
  const contractFactory = await ethers.getContractFactory("CoitonERC20");
  const contract = contractFactory.attach("0x900358D41F9E819d64fE6804780D13e55e004415");
  const ACCOUNT = "0xC0E11e7674B3267175569e1c42b85bB5554aFEB4";
  await (await contract.mintTo(ACCOUNT, 20e18.toString())).wait();
  await (await contract.approve("0x476b35EF9a2f387F16853d26b88bD90eCe157a16", 20e18.toString())).wait();

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
