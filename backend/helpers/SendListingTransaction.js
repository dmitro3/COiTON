const ethers = require("ethers");
const ABI = require("../config/abi.json")
require("dotenv").config();

exports.SendListingTransaction = async (id, details) => {
    const hash = ethers.solidityPackedKeccak256(
        [
            "address",
            "string",
            "string",
            "string",
            "string",
            "uint24",
            "string",
            "uint256",
            "string",
        ],
        [details.owner, details.country, details.state, details.city, details.address, details.postalCode, details.description, details.price, details.images.join(";")]
    );


    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const encryptedJsonKey = fs.readFileSync("../config/.encryptedKey.json", "utf8");
    let wallet = ethers.Wallet.fromEncryptedJsonSync(encryptedJsonKey, process.env.PRIVATE_KEY_PASSWORD);
    wallet = wallet.connect(provider)
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS,
        ABI,
        wallet);

    const tx = await contract.approveListing(id, hash, details.owner);
    const receipt = await tx.wait();

    if (receipt.status) {

        return { success: true, tx, message: "Transaction successful" }
    } else {
        return { success: false, tx, message: "Transaction failed" }
    }

};
