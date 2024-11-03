const express = require("express");
const router = express.Router();
const { Setups, Controls } = require("../models");

router.get("/", async (req, res) => {
  const listOfSetups = await Setups.findAll();
  res.json(listOfSetups);
});

router.post("/", async (req, res) => {
  const setupData = req.body;
  const newSetup = await Setups.create(setupData);

  const controlData = {
    client_name: setupData.client_candidate,
    employee1: setupData.employee1,
    employee2: setupData.employee2,
    net_value1: setupData.net_value1,
    net_value2: setupData.net_value2,
  };

  const newControl = await Controls.create(controlData);

  res.json({ newSetup, newControl });
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
