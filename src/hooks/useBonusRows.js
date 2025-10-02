import { useMemo } from "react";
import { MONTHS, STATUS, DISBURSEMENT, CLIENT_STATUS } from "../utils/constants";
import { parseCurrency } from "../utils/currency";
import { createStatusKey } from "../utils/bonusKeys";

export function useBonusRows({ controls, setups, clients, bonuses, selectedEmployee, selectedMonth, yearNumber }) {
  const setupByClient = useMemo(() => {
    const map = new Map();
    setups.forEach((setup) => {
      map.set(setup.client_candidate, setup);
    });
    return map;
  }, [setups]);

  const clientStatusMap = useMemo(() => {
    const map = new Map();
    clients.forEach((client) => {
      map.set(client.client_name, client.client_status);
    });
    return map;
  }, [clients]);

  const availableMonthNames = useMemo(() => {
    if (!selectedEmployee) return new Set();
    const monthsWithData = new Set();
    controls.forEach((control) => {
      const recordYear = control.createdAt ? new Date(control.createdAt).getFullYear() : yearNumber;
      if (recordYear !== yearNumber) return;
      MONTHS.forEach((month) => {
        const status = control[month.key];
        if (status === STATUS.ON_TIME || status === STATUS.LATE) {
          monthsWithData.add(month.name);
        }
      });
    });
    return monthsWithData;
  }, [controls, selectedEmployee, yearNumber]);

  const calculateRows = () => {
    if (!selectedEmployee || !selectedMonth) return [];

    const monthDefinition = MONTHS.find((m) => m.name === selectedMonth);
    if (!monthDefinition) return [];

    const existingBonusMap = new Map();
    const employeeSpecificBonuses = new Set();

    bonuses.forEach((bonus) => {
      const bonusYear = bonus.createdAt ? new Date(bonus.createdAt).getFullYear() : yearNumber;
      if (bonusYear !== yearNumber) return;
      const comboKey = `${bonus.client_name}|${bonus.month}`;
      if (bonus.employee_name) employeeSpecificBonuses.add(comboKey);
      const normalizedValue = parseCurrency(bonus.net_value);
      const keyWithEmployee = createStatusKey(
        bonus.client_name,
        bonus.month,
        bonus.employee_name || "",
        normalizedValue
      );
      existingBonusMap.set(keyWithEmployee, bonus);
      if (!bonus.employee_name) {
        const keyWithoutEmployee = createStatusKey(
          bonus.client_name,
          bonus.month,
          "",
          normalizedValue
        );
        if (!existingBonusMap.has(keyWithoutEmployee)) {
          existingBonusMap.set(keyWithoutEmployee, bonus);
        }
      }
    });

    const nextRows = [];
    controls.forEach((control) => {
      const recordYear = control.createdAt ? new Date(control.createdAt).getFullYear() : yearNumber;
      if (recordYear !== yearNumber) return;
      const setup = setupByClient.get(control.client_name);
      if (!setup) return;
      const clientStatus = clientStatusMap.get(control.client_name);
      if (clientStatus === CLIENT_STATUS.INACTIVE) return;

      const status = control[monthDefinition.key];
      if (!(status === STATUS.ON_TIME || status === STATUS.LATE)) return;

      let netValueSource = "0";
      if (setup.employee1 === selectedEmployee) {
        netValueSource = setup.net_value1;
      } else if (setup.employee2 === selectedEmployee) {
        netValueSource = setup.net_value2;
      } else {
        return;
      }

      const normalizedSetupValue = parseCurrency(netValueSource);
      const keyWithEmployee = createStatusKey(
        control.client_name,
        monthDefinition.name,
        selectedEmployee,
        normalizedSetupValue
      );
      const keyWithoutEmployee = createStatusKey(
        control.client_name,
        monthDefinition.name,
        "",
        normalizedSetupValue
      );

      let existing = existingBonusMap.get(keyWithEmployee);
      const comboKey = `${control.client_name}|${monthDefinition.name}`;
      if (!existing && !employeeSpecificBonuses.has(comboKey)) {
        const fallback = existingBonusMap.get(keyWithoutEmployee);
        if (!fallback?.employee_name) {
          existing = fallback;
        }
      }

      const workStatus = existing?.work_status || status;
      const netValue = netValueSource;
      const disbursement = existing?.disbursement_bonus || DISBURSEMENT.UNPAID;

      nextRows.push({
        clientName: control.client_name,
        employee: selectedEmployee,
        month: monthDefinition.name,
        workStatus,
        netValue,
        netValueNumber: parseCurrency(netValue),
        disbursement_bonus: disbursement,
        isPersisted: Boolean(existing),
      });
    });

    nextRows.sort((a, b) => a.clientName.localeCompare(b.clientName));
    return nextRows;
  };

  return { availableMonthNames, calculateRows };
}

