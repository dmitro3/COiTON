const router = require("express").Router();
const { ExchangeController } = require("../../controllers");
// const VerifyToken = require("../../helpers/VerifyToken");

router.post("/:ref", ExchangeController.initiateTx);


module.exports = router;
