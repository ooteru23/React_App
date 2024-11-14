const express = require("express");
const router = express.Router();
const { Bonuses } = require("../models");

router.get("/", async (req, res) => {
  const { employee_name, month } = req.query;
  const listOfBonuses = await Bonuses.findAll({
    where: { employee_name, month },
  });
  res.json(listOfBonuses);
});

router.post("/", async (req, res) => {
  const bonus = req.body;

  const existingBonus = await Bonuses.findOne({
    where: {
      employee_name: bonus[0].employee_name,
      client_name: bonus[0].client_name,
      month: bonus[0].month,
      work_status: bonus[0].work_status,
      net_value: bonus[0].net_value,
      disbursement_bonus: bonus[0].disbursement_bonus,
    },
  });

  if (existingBonus) {
    return res.status(409).json({ message: "Data Already In There" });
  }

  await Bonuses.bulkCreate(bonus);
  res.json(bonus);
});

module.exports = router;
