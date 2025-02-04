const express = require("express");
const router = express.Router();
const { Offers, Clients } = require("../models");

router.get("/", async (req, res) => {
  const listOfOffers = await Offers.findAll();
  res.json(listOfOffers);
});

router.post("/", async (req, res) => {
  const offer = req.body;
  await Offers.create(offer);
  res.json(offer);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listOfOffers = await Offers.findByPk(id);
  res.json(listOfOffers);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  await Offers.update(updatedData, {
    where: { id: id },
  });

  const offer = await Offers.findOne({ where: { id: id } });

  if (updatedData.offer_status === "Accepted") {
    const clientData = {
      client_name: offer.client_candidate,
      address: offer.address,
      pic: offer.pic,
      telephone: offer.telephone,
      service: offer.service,
      contract_value: offer.price,
      client_status: "Active",
    };

    await Clients.create(clientData);
  }
  res.json(updatedData);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Offers.destroy({
    where: { id: id },
  });
  res.json({ message: "Offers Data Deleted" });
});

module.exports = router;
