const ethers = require("ethers");
const ABI = require("../config/abi.json")
require("dotenv").config();

exports.SendListingTransaction = async (id, details) => {
    const hash = ethers.solidityPackedKeccak256(
        [
            "address",
            "address",
            "string",
            "string",
            "string",
            "string",
            "uint24",
            "string",
            "uint256",
            "string",
            "string",
            "string",
        ],
        [details.owner, details.agent, details.country, details.state, details.city, details.address, details.postalCode, details.description, details.price, details.images.join(";"), details.coverImage, details.features]
    );


    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const encryptedJsonKey = fs.readFileSync("../config/.encryptedKey.json", "utf8");
    let wallet = ethers.Wallet.fromEncryptedJsonSync(encryptedJsonKey, process.env.PRIVATE_KEY_PASSWORD);
    wallet = wallet.connect(provider)
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS,
        ABI,
        wallet);

    const listing = {
        owner: details.owner,
        agentId: details.agent,
        country: details.country,
        state: details.state,
        city: details.city,
        estateAddress: details.estateAddress,
        postalCode: details.postalCode,
        description: details.description,
        price: details.price,
        images: details.images,
        features: details.features,
        coverImage: details.coverImage,
        id: id,
    }

    const tx = await contract.delegateListingForApproval(details.state, hash, listing);
    const receipt = await tx.wait();

    if (receipt.status) {

        return { success: true, tx, message: "Transaction successful" }
    } else {
        return { success: false, tx, message: "Transaction failed" }
    }

};
