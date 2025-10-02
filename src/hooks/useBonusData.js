import { useEffect, useState } from "react";
import { list as listEmployees } from "../services/employeesApi";
import { list as listControls } from "../services/controlsApi";
import { list as listSetups } from "../services/setupsApi";
import { list as listClients } from "../services/clientsApi";
import { list as listBonuses } from "../services/bonusesApi";

export function useBonusData() {
  const [employees, setEmployees] = useState([]);
  const [controls, setControls] = useState([]);
  const [setups, setSetups] = useState([]);
  const [clients, setClients] = useState([]);
  const [bonuses, setBonuses] = useState([]);

  useEffect(() => {
    listEmployees()
      .then((rows) => {
        setEmployees(rows);
      })
      .catch((error) => console.error("Error getting employees:", error));
  }, []);

  useEffect(() => {
    listControls()
      .then((rows) => setControls(rows))
      .catch((error) => console.error("Error getting controls:", error));
  }, []);

  useEffect(() => {
    listSetups()
      .then((rows) => setSetups(rows))
      .catch((error) => console.error("Error getting setups:", error));
  }, []);

  useEffect(() => {
    listClients()
      .then((rows) => setClients(rows))
      .catch((error) => console.error("Error getting clients:", error));
  }, []);

  useEffect(() => {
    listBonuses()
      .then((rows) => setBonuses(rows))
      .catch((error) => console.error("Error getting bonuses:", error));
  }, []);

  return {
    employees,
    controls,
    setups,
    clients,
    bonuses,
    setBonuses,
  };
}

