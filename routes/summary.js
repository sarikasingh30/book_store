const express = require("express");
const router = express.Router();
const summaryController = require("../controllers/summary");

router.post("/", summaryController.postSummary);

module.exports = router;
