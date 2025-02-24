const express = require("express");
const router = express.Router();
const { Clients } = require("../models");

router.get("/", async (req, res) => {
  const listOfClients = await Clients.findAll();
  res.json(listOfClients);
});

router.put("/:id", async (req, res) => {
  const clientId = req.params.id;
  const { client_status } = req.body;

  Clients.findByPk(clientId)
    .then((client) => {
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      client.client_status = client_status;
      return client.save();
    })
    .then(() => {
      res.json({ message: "Client status updated successfully" });
    })
    .catch((err) => {
      console.error("Error updating client status", err);
      res.status(500).json({ message: "Error updating client status" });
    });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Clients.destroy({
    where: { id: id },
  });
  res.json({ message: "Client Data Deleted" });
});

module.exports = router;
