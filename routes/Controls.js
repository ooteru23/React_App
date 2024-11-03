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
