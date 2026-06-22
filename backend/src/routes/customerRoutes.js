const express = require("express");
const router = express.Router();
const {
  getCustomers,
  createCustomer,
  updateCustomer,
} = require("../controllers/customerController");

// We can add auth middleware here later if needed
// const { protect, authorize } = require("../middleware/auth");
// router.use(protect);

router.route("/")
  .get(getCustomers)
  .post(createCustomer);

router.route("/:id")
  .put(updateCustomer);

module.exports = router;
