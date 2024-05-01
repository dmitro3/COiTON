const { ethers } = require("hardhat");
const data = require("./data.json");
async function main() {
  const contractFactory = await ethers.getContractFactory("Dao");
  const contract = contractFactory.attach(data.contractAddress);
  // const LISTING_ID = "1950a253-f25e-4e2d-beb2-469c3456ad7f";

  // const prank = await ethers.getSigner(data.admin);
  await (
    await contract.createAdministration(
      data.admin,
      "Kaduna State",
      "Kaduna State"
    )
  ).wait();
  await (
    await contract.addAgent("Kaduna State", {
      id: data.agent,
      name: "Javis",
      code: "code",
      region: "region",
      bio: "bio",
      deleted: false,
    })
  ).wait();
  // await (await contract.connect(prank).approveListing("lagos", 1, LISTING_ID)).wait()
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
