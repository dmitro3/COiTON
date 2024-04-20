const router = require("express").Router();
const { ReportController } = require("../../controllers")

router.get("/", ReportController.getReports);
router.post("/", ReportController.createReport);
router.delete("/:id", ReportController.deleteReport);


module.exports = router;
