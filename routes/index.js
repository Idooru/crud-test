const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/", async (req, res, next) => {
    res.send("<h1>CRUD TEST SERVER</h1>");
});

module.exports = router;
