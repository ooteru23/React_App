const express = require("express");
const router = express.Router();
const { Clients } = require("../models");

router.get("/", async (req, res) => {
  const listOfClients = await Clients.findAll();
  res.json(listOfClients);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Clients.destroy({
    where: { id: id },
  });
  res.json({ message: "Clients Data Deleted" });
});

module.exports = router;
