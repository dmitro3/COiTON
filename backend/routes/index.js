const router = require("express").Router();
const ListingRoute = require("./listings/ListingRoutes");
const ReportRoute = require("./reports/ReportRoutes");
const TestimoniesRoute = require("./testimonies/TestimoniesRoutes");


router.use("/listings", ListingRoute);
router.use("/reports", ReportRoute);
router.use("/testimonies", TestimoniesRoute);

module.exports = router;
