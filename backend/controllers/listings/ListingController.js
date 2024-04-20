const { ResponseMessage } = require("../../helpers/Response");
const { Listing } = require("../../models");

exports.createListing = async (req, res) => {
    try {
        const data = req.body;
        const newListing = await Listing.create(data);
        return ResponseMessage(res, true, 200, "Listing created successfully", newListing);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}


exports.getListings = async (req, res) => {
    try {
        const { page, size } = req.query;
        const listings = await Listing.findAndCountAll({
            distinct: true,
            limit: size ?? 50,
            offset: (page ?? 0) * (size ?? 50),
            order: [["createdAt", "DESC"]],
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
        return ResponseMessage(res, true, 200, "Listing fetched", listing);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}