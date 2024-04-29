const router = require("express").Router();
const ListingRoute = require("./listings/ListingRoutes");
const ReportRoute = require("./reports/ReportRoutes");
const TestimoniesRoute = require("./testimonies/TestimoniesRoutes");
const ExchangeRoute = require("./exchange/ExchangeRoutes");
const IndicesRoute = require("./marketIndices/MarketIndicesRoutes");


router.use("/listings", ListingRoute);
router.use("/reports", ReportRoute);
router.use("/testimonies", TestimoniesRoute);
router.use("/exchange", ExchangeRoute);
router.use("/indices", IndicesRoute);

module.exports = router;
