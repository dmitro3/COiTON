const { ethers } = require("hardhat");
const data = require("./data.json");
async function main() {
  const contractFactory = await ethers.getContractFactory("Dao");
  const contract = contractFactory.attach(data.contractAddress);
  const LISTING_ID = "2f8875d6-ff2a-44f4-ba11-3d907c8f3212";

  const prank = await ethers.getSigner(data.admin);
  await (
    await contract.connect(prank).approveListing("Kaduna State", 1, LISTING_ID)
  ).wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
