const { ethers } = require("hardhat");
const data = require("./data.json");
async function main() {
  const contractFactory = await ethers.getContractFactory("Dao");
  const contract = contractFactory.attach(data.contractAddress);
  const LISTING_ID = "61383278-ffb4-4420-99ec-51d630512c90";

  const prank = await ethers.getSigner(data.admin);
  await (
    await contract.connect(prank).approveListing("Plateau", 1, LISTING_ID)
  ).wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
