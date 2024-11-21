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

  const existingBonus = await Bonuses.findAll({
    where: { employee_name: bonus.map((item) => item.employee_name) },
    attributes: [
      "employee_name",
      "client_name",
      "month",
      "work_status",
      "net_value",
      "disbursement_bonus",
    ],
  }).then((data) => data.map((item) => item.employee_name));

  const newObjects = bonus.filter(
    (item) => !existingBonus.includes(item.employee_name)
  );

  const response = newObjects.length
    ? await Bonuses.bulkCreate(newObjects)
    : [];

  res.json({
    message: newObjects.length
      ? "Data Saved successfully."
      : "Data Already Exists.",
    newData: response,
    existingData: existingBonus,
  });
});

module.exports = router;
