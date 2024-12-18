const express = require("express");
const router = express.Router();
const { Bonuses } = require("../models");

router.get("/", async (req, res) => {
  const listOfBonuses = await Bonuses.findAll();
  res.json(listOfBonuses);
});

router.post("/", async (req, res) => {
  const bonus = req.body;
  await Bonuses.bulkCreate(bonus);
  res.json(bonus);
});

module.exports = router;
