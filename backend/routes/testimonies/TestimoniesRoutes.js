const router = require("express").Router();
const { TestimoniesController } = require("../../controllers")

router.get("/all", TestimoniesController.getAllTestimonies);
router.get("/approved", TestimoniesController.getApprovedTestimonies);
router.post("/", TestimoniesController.createTestimony);
router.put("/:id", TestimoniesController.approveTestimony);
router.delete("/:id", TestimoniesController.deleteTestimony);


module.exports = router;
