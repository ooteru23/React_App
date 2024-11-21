const express = require("express");
const router = express.Router();
const { Reports } = require("../models");
const { months } = require("moment");

router.get("/", async (req, res) => {
  const listOfReports = await Reports.findAll();
  res.json(listOfReports);
});

router.post("/", async (req, res) => {
  const report = req.body;

  await Reports.create(report);
  res.json(report);
});

module.exports = router;
