const router = require("express").Router();
const ListingRoute = require("./listings/ListingRoutes");
const ReportRoute = require("./reports/ReportRoutes");


router.use("/listings", ListingRoute);
router.use("/reports", ReportRoute);

module.exports = router;
