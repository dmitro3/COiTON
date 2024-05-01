const { ethers } = require("hardhat");
const data = require("./data.json");
async function main() {
  const contractFactory = await ethers.getContractFactory("RealEstate");
  const contract = contractFactory.attach(
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  );
  // const contract = ethers.getContractAt("IDao", "0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D");
  const listings = await contract.getListings();

  console.log(listings);
  console.log(listings.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
