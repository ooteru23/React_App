const express = require("express");
const router = express.Router();
const { Controls, Offers } = require("../models");

router.get("/", async (req, res) => {
  const listOfControls = await Controls.findAll();
  res.json(listOfControls);
});
router.get("/adjusted-data", async (req, res) => {
  // Ambil data dari tabel offers
  const offers = await Offers.findAll({
    attributes: ["client_candidate", "period_time"],
  });

  // Ambil semua data dari tabel controls
  const controls = await Controls.findAll();

  // Sesuaikan period_time di offers dengan month_jan hingga month_dec di controls
  const adjustedData = controls.map((control) => {
    const matchedOffer = offers.find(
      (offer) => offer.client_candidate === control.client_name
    );

    if (matchedOffer) {
      const periodMonth = new Date(matchedOffer.period_time).getMonth();
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
          index >= periodMonth ? control[month] || "ON PROCESS" : "";
      });
    }

    return control;
  });

  res.json(adjustedData);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listOfControls = await Controls.findByPk(id);
  res.json(listOfControls);
});

router.post("/", async (req, res) => {
  const control = req.body;

  const existingControl = await Controls.findAll({
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
    (item) => !existingControl.includes(item.client_name)
  );

  const response = newObjects.length
    ? await Controls.bulkCreate(newObjects)
    : [];

  res.json({
    message: newObjects.length
      ? "Data Saved successfully."
      : "Data Already Exists.",
    newData: response,
    existingData: existingControl,
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
