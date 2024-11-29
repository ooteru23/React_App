const express = require("express");
const router = express.Router();
const { Clients, Controls, Setups } = require("../models");

router.get("/", async (req, res) => {
  const listOfClients = await Clients.findAll();
  res.json(listOfClients);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const client = await Clients.findOne({ where: { id } });
  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  const clientName = client.client_name;

  // Hapus data terkait di tabel Setups dan Controls
  await Setups.destroy({ where: { client_candidate: clientName } });
  await Controls.destroy({ where: { client_name: clientName } });

  // Hapus data di tabel Clients
  await Clients.destroy({ where: { id } });

  res.json({ message: "Client and related data deleted successfully" });
});

module.exports = router;
