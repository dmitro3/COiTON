const { ethers } = require("hardhat");


async function deployApi() {

  const GetAPI = await ethers.getContractFactory("APIConsumer");
  const getApi = await GetAPI.deploy();
  await getApi.deployed();
  console.log("getApi deployed:", getApi.address);
}


if (require.main === module) {
  deployApi()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}