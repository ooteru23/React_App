const express = require("express");
const router = express.Router();
const { Calculates } = require("../models");

router.get("/", async (req, res) => {
  const listOfCalculates = await Calculates.findAll();
  res.json(listOfCalculates);
});

router.post("/", async (req, res) => {
  const calculate = req.body;
  await Calculates.create(calculate);
  res.json(calculate);
});

module.exports = router;
