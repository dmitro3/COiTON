const router = require("express").Router();
const { IndicesController } = require("../../controllers");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store the file in memory (you can adjust this based on your needs)
const upload = multer({ storage: storage });

router.get("/:id", IndicesController.getIndices);
router.get("/stats/get", IndicesController.getStats);
router.post("/", upload.single("doc"), IndicesController.make);

module.exports = router;
