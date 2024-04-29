
const { ethers } = require("hardhat");
const data = require("./data.json");
async function main() {

    const contractFactory = await ethers.getContractFactory("Diamond");
    const contract = contractFactory.attach("0xC7143d5bA86553C06f5730c8dC9f8187a621A8D4");
    // const contract = ethers.getContractAt("IDao", "0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D");
    const listings = await contract.getListing();

    console.log(listings)
    console.log(listings.length);

}



main().catch(error => {
    console.error(error);
    process.exit(1);
})