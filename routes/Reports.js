const express = require("express");
const router = express.Router();
const { Reports } = require("../models");

router.get("/", async (_req, res) => {
  const listOfReports = await Reports.findAll({ order: [["id", "ASC"]] });
  res.json(listOfReports.map((row) => row.toJSON()));
});

router.post("/", async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : [req.body];
  const results = [];

  for (const entry of payload) {
    const { employee_name, month } = entry;

    if (!employee_name || !month) {
      continue;
    }

    const existing = await Reports.findOne({ where: { employee_name, month } });

    if (existing) {
      await existing.update(entry);
      results.push(existing.toJSON());
    } else {
      const created = await Reports.create(entry);
      results.push(created.toJSON());
    }
  }

  res.json(results);
});

module.exports = router;
