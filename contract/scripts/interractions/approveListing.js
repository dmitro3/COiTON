
const { ethers } = require("hardhat");
const data = require("./data.json");
async function main() {

    const contractFactory = await ethers.getContractFactory("Dao");
    const contract = contractFactory.attach(data.contractAddress);
    const LISTING_ID = "6c170c4c-e945-4a29-9b7d-eac38b6b58cd";

    const prank = await ethers.getSigner(data.admin);
    await (await contract.connect(prank).approveListing("lagos", 1, LISTING_ID)).wait()

}



main().catch(error => {
    console.error(error);
    process.exit(1);
})