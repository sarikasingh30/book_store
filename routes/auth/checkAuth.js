const express = require("express");
const router = express.Router();
const checkAuthController = require("../../controllers/auth/checkAuth");
router.get("/", checkAuthController.check);

module.exports = router;
