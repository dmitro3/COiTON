const router = require("express").Router();
const { ListingController } = require("../../controllers")

router.get("/", ListingController.getListings);
router.post("/", ListingController.createListing);
router.delete("/:id", ListingController.deleteListing);


module.exports = router;
