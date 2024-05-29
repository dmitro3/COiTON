const { ResponseMessage } = require("../../helpers/Response");
const { SendListingTransaction } = require("../../helpers/ContractInterraction");
const { Listing, MarketIndices } = require("../../models");

exports.createListing = async (req, res) => {
    try {
        const data = req.body;
        const newListing = await Listing.create({ details: data });
        const indices = await MarketIndices.create({ estateId: newListing.id, indexValue: data.price });
        const tx = await SendListingTransaction(newListing.id, data)
        return ResponseMessage(res, true, 200, "Listing created successfully", { newListing, tx, indices });
    } catch (error) {
        console.log(error.message)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}

exports.updateMarketIndice = async (req, res) => {
    try {
        const {id,share,price} = req.params;
        const find = await MarketIndices.findOne({
            where: {
                estateId: id
            }
        });
        

        if (find) {
            
            const indices = await MarketIndices.create({ estateId: id, indexValue:price,priceChange:share  });
            return ResponseMessage(res, true, 200, "Indice created successfully",  {...indices,id:share});
        }

        return ResponseMessage(res,false,400,"Invalid Id",{})
       
    } catch (error) {
        console.log(error.message)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}



exports.approveListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByPk(id)
        if (listing) {
            const transaction = await SendListingTransaction(id, listing.details);
            if (transaction.success) {
                return ResponseMessage(res, true, 200, "Listing approved successfully", tx);

            } else {
                return ResponseMessage(res, false, 400, transaction.message, transaction.tx);

            }
        } else {
            return ResponseMessage(res, false, 400, "Listing not found", {});
        }
    } catch (error) {
        console.log(error.message)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}


exports.getListings = async (req, res) => {
    try {
        const { page, size } = req.query;
        const listings = await Listing.findAndCountAll({
            distinct: true,
            limit: size ?? 50,
            offset: (page ?? 0) * (size ?? 50),
            order: [["createdAt", "ASC"]],
        })
        return ResponseMessage(res, true, 200, "Listing fetched", listings);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}


exports.getIndices = async (req, res) => {
    try {
        const { page, size } = req.query;
        const listings = await MarketIndices.findAndCountAll({
            distinct: true,
            limit: size ?? 50,
            offset: (page ?? 0) * (size ?? 50),
            order: [["createdAt", "ASC"]],
        })
        return ResponseMessage(res, true, 200, "Listing fetched", listings);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}


exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByPk(id);
        if (listing) {
            await listing.destroy();
        }
        return ResponseMessage(res, true, 200, "Listing deleted", listing);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}