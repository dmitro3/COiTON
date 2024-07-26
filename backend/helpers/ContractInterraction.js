const ethers = require("ethers");
const ABI = require("../config/abi.json");
const REAL_ESTATE_ABI = require("../config/real_estate_abi.json");
const fs = require("fs-extra");
require("dotenv").config();

exports.SendListingTransaction = async (id, details) => {
  // console.log(details, process.env.RPC_URL);
  try {
    const region = details.region;
    const description = details.description;
    const hash = ethers.solidityPackedKeccak256(
      ["string", "address", "string", "uint24", "string", "uint256", "string"],
      [
        id,
        details.agentId,
        region,
        details.postalCode,
        description,
        details.price,
        details.images.join(";"),
      ]
    );

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const encryptedJsonKey = fs.readFileSync(
      "./config/.encryptedKey.json",
      "utf8"
    );
    let wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJsonKey,
      process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = wallet.connect(provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      wallet
    );

    const listing = {
      owner: details.owner.split(";")[0].trim(),
      agentId: details.agentId,
      region,
      postalCode: details.postalCode,
      description,
      price: details.price,
      images: details.images.join(";"),
      coverImage: details.coverImage,
      id: id,
    };

    // console.log(hash);
    // return;

    const tx = await contract.delegateListingForApproval(
      details.state,
      hash,
      listing
    );
    const receipt = await tx.wait();

    if (receipt.status) {
      return { success: true, tx: receipt, message: "Transaction successful" };
    } else {
      return { success: false, tx: receipt, message: "Transaction failed" };
    }
  } catch (error) {
    console.log(error);
    return { success: false, tx: error.message, message: "Transaction failed" };
  }
};

exports.exchange = async (address, amount) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const encryptedJsonKey = fs.readFileSync(
      "./config/.encryptedKey.json",
      "utf8"
    );
    let wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJsonKey,
      process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = wallet.connect(provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      wallet
    );

    const tx = await contract.mintTo(address, amount);
    const receipt = await tx.wait();
    const bal = await contract.balanceOf(address);
    console.log(bal.toString());
    if (receipt.status) {
      return { success: true, tx, message: "Transaction successful" };
    } else {
      return { success: false, tx, message: "Transaction failed" };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      tx: {},
      message: "Transaction faileddddd",
    };
  }
};

exports.bulkUpdate = async (data) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const encryptedJsonKey = fs.readFileSync(
      "./config/.encryptedKey.json",
      "utf8"
    );
    let wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJsonKey,
      process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = wallet.connect(provider);
    const contract = new ethers.Contract(
      process.env.REAL_ESTATE_CONTRACT_ADDRESS,
      REAL_ESTATE_ABI,
      wallet
    );

    const tx = await contract.bulkUpdate(data);
    const receipt = await tx.wait();

    if (receipt.status) {
      return { success: true, tx, message: "Transaction successful" };
    } else {
      return { success: false, tx, message: "Transaction failed" };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      tx: {},
      message: "Transaction faileddddd",
    };
  }
};
