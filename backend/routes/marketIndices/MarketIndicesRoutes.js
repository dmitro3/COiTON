const router = require("express").Router();
const { IndiesController } = require("../../controllers");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store the file in memory (you can adjust this based on your needs)
const upload = multer({ storage: storage });

router.get("/:id", IndiesController.getIndices);
router.post("/", upload.single("doc"), IndiesController.make);


module.exports = router;
