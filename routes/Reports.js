const express = require("express");
const router = express.Router();
const { Reports } = require("../models");

router.get("/", async (req, res) => {
  const listOfReports = await Reports.findAll();
  res.json(listOfReports);
});

router.post("/", async (req, res) => {
  const report = req.body;

  const existingReport = await Reports.findOne({
    where: {
      employee_name: report[0].employee_name,
      salary_deduction: report[0].salary_deduction,
      month_ontime: report[0].month_ontime,
      month_late: report[0].month_late,
      bonus_component: report[0].bonus_component,
      percent_ontime: report[0].percent_ontime,
      percent_late: report[0].percent_late,
      total_ontime: report[0].total_ontime,
      total_late: report[0].total_late,
      bonus_ontime: report[0].bonus_ontime,
      bonus_late: report[0].bonus_late,
    },
  });

  if (existingReport) {
    return res.status(409).json({ message: "Data sudah ada di database." });
  }

  await Reports.create(report);
  res.json(report);
});

module.exports = router;
