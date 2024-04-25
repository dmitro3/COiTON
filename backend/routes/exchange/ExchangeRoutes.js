const router = require("express").Router();
const { ExchangeController } = require("../../controllers");
// const VerifyToken = require("../../helpers/VerifyToken");

router.post("/", ExchangeController.initiateTx);


module.exports = router;
