const { ethers } = require("hardhat");
async function main() {
  const contractFactory = await ethers.getContractFactory("CoitonERC20");
  const contract = contractFactory.attach("0x900358D41F9E819d64fE6804780D13e55e004415");
  const ACCOUNT = "0xB6B0746f8137Db1E788597CFcD818e2B3bfF6324";
  await (await contract.mintTo(ACCOUNT, 20e18.toString())).wait();
  await (await contract.approve("0x9e741a7ef15d0e2C622F44Dd9cFE85faEF3cc740", 20e18.toString())).wait();

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
