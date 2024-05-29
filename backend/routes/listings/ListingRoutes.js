const router = require("express").Router();
const { ListingController } = require("../../controllers");
const VerifyToken = require("../../helpers/VerifyToken");

router.get("/", ListingController.getListings);
router.get("/indices", ListingController.getIndices);
router.post("/", ListingController.createListing);
router.get("/event/:id/:share/:price", ListingController.updateMarketIndice);
router.post("/:id", VerifyToken, ListingController.approveListing);
router.delete("/:id", ListingController.deleteListing);


module.exports = router;
