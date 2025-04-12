const express = require("express");
const getMoodSuggestions = require("../controllers/mood");

const router = express.Router();

router.post("/", getMoodSuggestions.check);

module.exports = router;
