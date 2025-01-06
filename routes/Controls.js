const express = require("express");
const router = express.Router();
const { Controls, Clients } = require("../models");

router.get("/", async (req, res) => {
  const listOfControls = await Controls.findAll();
  res.json(listOfControls);
});
router.get("/adjusted-data", async (req, res) => {
  const clients = await Clients.findAll({
    attributes: ["client_name", "createdAt"],
  });

  const controls = await Controls.findAll();

  const adjustedData = controls.map((control) => {
    const matchedClient = clients.find(
      (client) => client.client_name === control.client_name
    );

    if (matchedClient) {
      const syncMonth = new Date(matchedClient.createdAt).getMonth();
      const months = [
        "month_jan",
        "month_feb",
        "month_mar",
        "month_apr",
        "month_may",
        "month_jun",
        "month_jul",
        "month_aug",
        "month_sep",
        "month_oct",
        "month_nov",
        "month_dec",
      ];

      months.forEach((month, index) => {
        control[month] =
          index >= syncMonth ? control[month] || "ON PROCESS" : "";
      });
    }

    return control;
  });

  res.json(adjustedData);
});

router.post("/", async (req, res) => {
  const control = req.body;
  await Controls.bulkCreate(control);
  res.json(control);
});

router.post("/creating-data", async (req, res) => {
  const control = req.body;
  await Controls.bulkCreate(control, {
    ignoreDuplicates: true,
    updateOnDuplicate: [
      "client_name",
      "employee1",
      "employee2",
      "net_value1",
      "net_value2",
    ],
  });
  res.json(control);
});

router.post("/update-data", async (req, res) => {
  const controls = req.body;

  const updatePromises = controls.map((control) =>
    Controls.update(control, {
      where: { id: control.id },
    })
  );

  await Promise.all(updatePromises);

  res.json({ message: "Data updated successfully!" });
});

module.exports = router;
