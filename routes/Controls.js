const express = require("express");
const router = express.Router();
const { Controls } = require("../models");
const { Op } = require("sequelize");

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

  const existingClientNames = await Controls.findAll({
    where: { client_name: control.map((item) => item.client_name) },
    attributes: [
      "client_name",
      "employee1",
      "employee2",
      "net_value1",
      "net_value2",
    ],
  }).then((data) => data.map((item) => item.client_name));

  const newObjects = control.filter(
    (item) => !existingClientNames.includes(item.client_name)
  );

  const response = newObjects.length
    ? await Controls.bulkCreate(newObjects)
    : [];

  res.json({
    message: newObjects.length
      ? "Data Saved successfully."
      : "Data Already Exists.",
    newData: response,
    existingData: existingClientNames,
  });
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
