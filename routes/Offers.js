const express = require("express");
const router = express.Router();
const { Offers } = require("../models");

router.get("/", async (req, res) => {
  const listOfOffers = await Offers.findAll();
  res.json(listOfOffers);
});

router.post("/", async (req, res) => {
  const offer = req.body;
  await Offers.create(offer);
  res.json(offer);
});
module.exports = router;
