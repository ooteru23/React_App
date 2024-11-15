const express = require("express");
const router = express.Router();
const { Reports } = require("../models");

router.get("/", async (req, res) => {
  const listOfReports = await Reports.findAll();
  res.json(listOfReports);
});

router.post("/", async (req, res) => {
  const report = req.body;

  if (
    (!Array.isArray(report) && typeof report !== "object") ||
    (Array.isArray(report) && report.length === 0)
  ) {
    return res.status(400).json({ message: "Invalid report data" });
  }

  const reportData = Array.isArray(report) ? report[0] : report;

  const existingReport = await Reports.findOne({
    where: {
      employee_name: reportData.employee_name,
      salary_deduction: reportData.salary_deduction,
      month_ontime: reportData.month_ontime,
      month_late: reportData.month_late,
      bonus_component: reportData.bonus_component,
      percent_ontime: reportData.percent_ontime,
      percent_late: reportData.percent_late,
      total_ontime: reportData.total_ontime,
      total_late: reportData.total_late,
      bonus_ontime: reportData.bonus_ontime,
      bonus_late: reportData.bonus_late,
    },
  });

  if (existingReport) {
    return res.status(409).json({ message: "Data sudah ada di database." });
  }

  await Reports.create(report);
  res.json(report);
});

module.exports = router;
