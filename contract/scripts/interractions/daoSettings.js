const { ethers } = require("hardhat");
const data = require("./data.json");
async function main() {
  const contractFactory = await ethers.getContractFactory("Dao");
  const contract = contractFactory.attach(data.contractAddress);
  const states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT (Federal Capital Territory)",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"];



  for (__state of states) {

    await (
      await contract.createAdministration(
        data.admin,
        __state,
        __state
      )
    ).wait();
    await (
      await contract.addAgent(__state, {
        id: data.agent,
        name: "Javis",
        code: "code",
        region: "region",
        bio: "bio",
        deleted: false,
      })
    ).wait();
    console.log("Registered", __state);
  }


  // await (await contract.connect(prank).approveListing("lagos", 1, LISTING_ID)).wait()
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
