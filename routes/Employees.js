const express = require("express");
const router = express.Router();
const { Employees } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  const listOfEmployees = await Employees.findAll();
  res.json(listOfEmployees);
});

router.post("/", async (req, res) => {
  const employee = req.body;
  await Employees.create(employee);
  res.json(employee);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listOfEmployees = await Employees.findByPk(id);
  res.json(listOfEmployees);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  await Employees.update(updatedData, {
    where: { id: id },
  });
  res.json(updatedData);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Employees.destroy({
    where: { id: id },
  });
  res.json({ message: "Employee Data Deleted" });
});

module.exports = router;
