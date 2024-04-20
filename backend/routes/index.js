const router = require("express").Router();
const ListingRoute = require("./listings/ListingRoutes");


router.use("/listings", ListingRoute);

module.exports = router;
