const express = require("express");
const router = express.Router();
const { Reports } = require("../models");

router.get("/", async (req, res) => {
  const listOfReports = await Reports.findAll();
  res.json(listOfReports);
});

router.post("/", async (req, res) => {
  const report = req.body;
  await Reports.bulkCreate(report, { ignoreDuplicates: true });
  res.json(report);
});

module.exports = router;
