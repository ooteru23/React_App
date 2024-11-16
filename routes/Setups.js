const express = require("express");
const router = express.Router();
const { Setups } = require("../models");

router.get("/", async (req, res) => {
  const listOfSetups = await Setups.findAll();
  res.json(listOfSetups);
});

router.post("/", async (req, res) => {
  const setup = req.body;
  await Setups.create(setup);
  res.json(setup);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listOfSetups = await Setups.findByPk(id);
  res.json(listOfSetups);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  await Setups.update(updatedData, {
    where: { id: id },
  });
  res.json(updatedData);
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Setups.destroy({
    where: { id: id },
  });
  res.json({ message: "Setup Data Deleted" });
});

module.exports = router;
