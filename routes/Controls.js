const express = require("express");
const router = express.Router();
const { Controls } = require("../models");

router.get("/", async (req, res) => {
  const listOfControls = await Controls.findAll();
  res.json(listOfControls);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listOfControls = await Controls.findByPk(id);
  res.json(listOfControls);
});

router.post("/", async (req, res) => {
  const control = req.body;

  const existingControl = await Controls.findOne({
    where: {
      client_name: control[0].client_name,
      employee1: control[0].employee1,
      employee2: control[0].employee2,
      net_value1: control[0].net_value1,
      net_value2: control[0].net_value2,
    },
  });

  if (existingControl) {
    return res.status(409).json({ message: "Data Already Exists" });
  }

  await Controls.bulkCreate(control);
  res.json(control);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  await Controls.update(updatedData, {
    where: { id: id },
  });
  res.json(updatedData);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Controls.destroy({
    where: { id: id },
  });
  res.json({ message: "Controls Data Deleted" });
});

module.exports = router;
