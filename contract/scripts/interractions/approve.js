const { ethers } = require("hardhat");
async function main() {
  const contractFactory = await ethers.getContractFactory("CoitonERC20");
  const contract = contractFactory.attach(
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  );
  const ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  await (await contract.mintTo(ACCOUNT, (20e18).toString())).wait();
  await (
    await contract.approve(
      "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
      (20e18).toString()
    )
  ).wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
