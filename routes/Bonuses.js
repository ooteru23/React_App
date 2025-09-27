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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const bonus = await Bonuses.findByPk(id);

  if (!bonus) {
    return res.status(404).json({ success: false });
  }

  await bonus.destroy();
  res.json({ success: true });
});

module.exports = router;
