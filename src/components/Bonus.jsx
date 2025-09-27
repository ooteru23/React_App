import React, { useEffect, useMemo, useState } from "react";
import {
  list as listBonuses,
  create as createBonus,
} from "../services/bonusesApi";
import { list as listEmployees } from "../services/employeesApi";
import { list as listClients } from "../services/clientsApi";
import { list as listControls } from "../services/controlsApi";
import { list as listSetups } from "../services/setupsApi";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const MONTHS = [
  { key: "month_jan", name: "January" },
  { key: "month_feb", name: "February" },
  { key: "month_mar", name: "March" },
  { key: "month_apr", name: "April" },
  { key: "month_may", name: "May" },
  { key: "month_jun", name: "June" },
  { key: "month_jul", name: "July" },
  { key: "month_aug", name: "August" },
  { key: "month_sep", name: "September" },
  { key: "month_oct", name: "October" },
  { key: "month_nov", name: "November" },
  { key: "month_dec", name: "December" },
];

const STATUS_WITH_BONUS = new Set(["ON TIME", "LATE"]);

const resolveYear = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? new Date().getFullYear() : parsed;
};

const parseCurrency = (value) => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? 0 : value;
  }

  if (!value) {
    return 0;
  }

  const numeric = value.toString().replace(/[^\d-]/g, "");
  return Number(numeric || 0);
};

const formatCurrency = (value) => parseCurrency(value).toLocaleString("id-ID");

const createBonusKey = (client, month, employee) => `${client}|${month}|${employee}`;

const createStatusKey = (client, month, employee, netValue) =>
  `${client}|${month}|${employee}|${netValue}`;

function Bonus() {
  const [employees, setEmployees] = useState([]);
  const [controls, setControls] = useState([]);
  const [setups, setSetups] = useState([]);
  const [clients, setClients] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentYear, setCurrentYear] = useState(
    () => new Date().getFullYear().toString()
  );
  const [salaryDeduction, setSalaryDeduction] = useState("");
  const [bonusRows, setBonusRows] = useState([]);
  const [page, setPage] = useState(1);

  const limit = 5;

  useEffect(() => {
    listEmployees()
      .then((rows) => {
        const activeEmployees = rows.filter(
          (employee) => employee.status !== "Inactive"
        );
        setEmployees(activeEmployees);
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

  const yearNumber = useMemo(() => resolveYear(currentYear), [currentYear]);

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

  const employeeClients = useMemo(() => {
    if (!selectedEmployee) {
      return new Set();
    }

    return new Set(
      setups
        .filter(
          (setup) =>
            setup.employee1 === selectedEmployee ||
            setup.employee2 === selectedEmployee
        )
        .map((setup) => setup.client_candidate)
    );
  }, [setups, selectedEmployee]);


  const availableMonthNames = useMemo(() => {
    if (!selectedEmployee) {
      return new Set();
    }

    const monthsWithData = new Set();

    controls.forEach((control) => {
      const recordYear = control.createdAt
        ? new Date(control.createdAt).getFullYear()
        : yearNumber;

      if (recordYear !== yearNumber) {
        return;
      }

      if (!employeeClients.has(control.client_name)) {
        return;
      }

      MONTHS.forEach((month) => {
        const status = control[month.key];
        if (STATUS_WITH_BONUS.has(status)) {
          monthsWithData.add(month.name);
        }
      });
    });

    return monthsWithData;
  }, [controls, employeeClients, selectedEmployee, yearNumber]);

  const hasAvailableMonths = availableMonthNames.size > 0;

  const totalPages = Math.max(1, Math.ceil(bonusRows.length / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedBonus = useMemo(
    () => bonusRows.slice((page - 1) * limit, page * limit),
    [bonusRows, page]
  );

  const salaryDeductionNumber = useMemo(
    () => parseCurrency(salaryDeduction),
    [salaryDeduction]
  );

  const stats = useMemo(() => {
    if (bonusRows.length === 0) {
      return {
        onTimeValue: 0,
        lateValue: 0,
        totalValue: 0,
        bonusComponent: 0,
        percentOnTime: 0,
        totalOnTime: 0,
        percentLate: 0,
        totalLate: 0,
        bonusOnTime: 0,
        bonusLate: 0,
        total: 0,
      };
    }

    let onTimeValue = 0;
    let lateValue = 0;

    bonusRows.forEach((row) => {
      if (row.disbursement_bonus === "Paid") {
        return;
      }

      if (row.workStatus === "ON TIME") {
        onTimeValue += row.netValueNumber;
      } else if (row.workStatus === "LATE") {
        lateValue += row.netValueNumber;
      }
    });

    const totalValue = onTimeValue + lateValue;
    const bonusComponent =
      salaryDeductionNumber > 0 ? totalValue - salaryDeductionNumber : 0;
    const percentOnTime =
      totalValue > 0 ? Math.round((onTimeValue / totalValue) * 100) : 0;
    const percentLate =
      totalValue > 0 ? Math.round((lateValue / totalValue) * 100) : 0;
    const totalOnTime = Math.round((percentOnTime / 100) * bonusComponent) || 0;
    const totalLate = Math.round((percentLate / 100) * bonusComponent) || 0;
    const bonusOnTime = Math.round((totalOnTime / 100) * 15) || 0;
    const bonusLate = Math.round((totalLate / 100) * 10) || 0;
    const total = bonusOnTime + bonusLate;

    return {
      onTimeValue,
      lateValue,
      totalValue,
      bonusComponent,
      percentOnTime,
      totalOnTime,
      percentLate,
      totalLate,
      bonusOnTime,
      bonusLate,
      total,
    };
  }, [bonusRows, salaryDeductionNumber]);

  const handleCalculate = (event) => {
    event.preventDefault();

    if (!selectedEmployee || !selectedMonth) {
      toast.warning("Pilih karyawan dan bulan terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const monthDefinition = MONTHS.find((month) => month.name === selectedMonth);

    if (!monthDefinition) {
      toast.error("Bulan yang dipilih tidak valid.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!hasAvailableMonths) {
      toast.info("Belum ada data kontrol dengan status ON TIME atau LATE.", {
        position: "top-right",
        autoClose: 3000,
      });
      setBonusRows([]);
      return;
    }

    if (!availableMonthNames.has(monthDefinition.name)) {
      toast.info("Belum ada data kontrol ON TIME atau LATE untuk bulan ini.", {
        position: "top-right",
        autoClose: 3000,
      });
      setBonusRows([]);
      return;
    }


    const existingBonusMap = new Map();

    bonuses.forEach((bonus) => {
      const bonusYear = bonus.createdAt
        ? new Date(bonus.createdAt).getFullYear()
        : yearNumber;

      if (bonusYear !== yearNumber) {
        return;
      }

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
      const recordYear = control.createdAt
        ? new Date(control.createdAt).getFullYear()
        : yearNumber;

      if (recordYear !== yearNumber) {
        return;
      }

      if (!employeeClients.has(control.client_name)) {
        return;
      }

      const setup = setupByClient.get(control.client_name);

      if (!setup) {
        return;
      }

      const clientStatus = clientStatusMap.get(control.client_name);
      if (clientStatus === "Inactive") {
        return;
      }

      const status = control[monthDefinition.key];
      if (!STATUS_WITH_BONUS.has(status)) {
        return;
      }

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

      if (!existing) {
        const fallback = existingBonusMap.get(keyWithoutEmployee);
        if (!fallback?.employee_name) {
          existing = fallback;
        }
      }

      const workStatus = existing?.work_status || status;
      const netValue = netValueSource;
      const disbursement = existing?.disbursement_bonus || "Unpaid";

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

    if (nextRows.length === 0) {
      toast.info("Tidak ada data bonus yang memenuhi kriteria.", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    nextRows.sort((a, b) => a.clientName.localeCompare(b.clientName));

    setBonusRows(nextRows);
    setPage(1);
  };

  const handleAddBonus = async (event) => {
    event.preventDefault();

    if (bonusRows.length === 0) {
      toast.info("Tidak ada data bonus untuk disimpan.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const salaryDeductionNumber = parseCurrency(salaryDeduction);

    if (!salaryDeduction || salaryDeductionNumber <= 0) {
      toast.warning("Hitung Pengurang (Hitungan Gaji) terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const rowsToSave = bonusRows.filter(
      (row) => !row.isPersisted && row.disbursement_bonus === "Unpaid"
    );

    if (rowsToSave.length === 0) {
      toast.info("Data bonus sudah ada.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await Promise.all(
        rowsToSave.map((row) =>
          createBonus({
            client_name: row.clientName,
            month: row.month,
            work_status: row.workStatus,
            net_value: row.netValue,
            disbursement_bonus: "Paid",
            employee_name: row.employee,
          })
        )
      );

      const savedKeys = new Set(
        rowsToSave.map((row) =>
          createBonusKey(row.clientName, row.month, row.employee)
        )
      );

      setBonusRows((prev) =>
        prev.map((row) =>
          savedKeys.has(createBonusKey(row.clientName, row.month, row.employee))
            ? { ...row, isPersisted: true, disbursement_bonus: "Paid" }
            : row
        )
      );

      const latestBonuses = await listBonuses();
      setBonuses(latestBonuses);

      toast.success("Data bonus berhasil disimpan.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error saving bonus data:", error);
      toast.error("Gagal menyimpan data bonus.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSalaryDeductionChange = (event) => {
    const digitsOnly = event.target.value.replace(/[^\d]/g, "");
    setSalaryDeduction(digitsOnly);
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Kalkulasi Bonus</h3>
        <form className="row g-3" onSubmit={handleCalculate}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="employee_name"> Nama Karyawan </label>
            <select
              name="employee_name"
              className="form-select"
              value={selectedEmployee}
              onChange={(event) => setSelectedEmployee(event.target.value)}
              required>
              <option value="" hidden>
                ---Please Choose Options---
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="year"> Tahun </label>
            <input
              type="text"
              className="form-control"
              value={currentYear}
              onChange={(event) => setCurrentYear(event.target.value)}
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="month"> Bulan </label>
            <select
              name="month"
              className="form-select"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              disabled={selectedEmployee === ""}
              required>
              <option value="" hidden>
                --Please Choose Options--
              </option>
              {MONTHS.map((month) => (
                <option key={month.key} value={month.name}>
                  {month.name}
                </option>
              ))}

            </select>
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Calculate
            </button>
          </div>
        </form>
        <br />
        <div className="row mt-3">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>Nomor</th>
                  <th>Nama Klien</th>
                  <th>Bulan</th>
                  <th>Status Pekerjaan</th>
                  <th>Net Value</th>
                  <th>Status Pencairan Bonus</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {paginatedBonus.length === 0 ? (
                  <tr>
                    <td colSpan={6}>Tidak ada data</td>
                  </tr>
                ) : (
                  paginatedBonus.map((row, index) => (
                    <tr key={`${row.clientName}-${row.month}`}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{row.clientName}</td>
                      <td>{row.month}</td>
                      <td>{row.workStatus}</td>
                      <td>{formatCurrency(row.netValue)}</td>
                      <td>{row.disbursement_bonus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-primary"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-primary"
            disabled={page >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(current + 1, totalPages))
            }>
            Next
          </button>
        </div>
        <form className="row g-3" onSubmit={handleAddBonus}>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="totalValue"> Total Value : </label>
            <input
              type="text"
              className="form-control w-50"
              value={formatCurrency(stats.totalValue)}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="salary_deduction"> Pengurang (Hitungan Gaji) : </label>
            <input
              type="text"
              className="form-control w-50"
              value={salaryDeductionNumber.toLocaleString("id-ID")}
              onChange={handleSalaryDeductionChange}
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="Debt_Recipient"> Hutang Penerimaan : </label>
            <input type="text" className="form-control w-50" disabled />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="component_bonus"> Bonus Komponen : </label>
            <input
              type="text"
              className="form-control w-50"
              value={formatCurrency(stats.bonusComponent)}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label className="percentOnTime"> Persentase Total ON TIME : </label>
            <input
              type="text"
              className="form-control w-50"
              value={`${stats.percentOnTime}%`}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Total ON TIME : </label>
            <input
              type="text"
              className="form-control w-50"
              value={formatCurrency(stats.totalOnTime)}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Persentase Total LATE : </label>
            <input
              type="text"
              className="form-control w-50"
              value={`${stats.percentLate}%`}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Total LATE : </label>
            <input
              type="text"
              className="form-control w-50"
              value={formatCurrency(stats.totalLate)}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Persentase Bonus ON TIME : </label>
            <input
              type="text"
              className="form-control w-50"
              value="15%"
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Bonus ON TIME : </label>
            <input
              type="text"
              className="form-control w-50"
              value={formatCurrency(stats.bonusOnTime)}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Persentase Bonus Late : </label>
            <input
              type="text"
              className="form-control w-50"
              value="10%"
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Bonus Late : </label>
            <input
              type="text"
              className="form-control w-50"
              value={formatCurrency(stats.bonusLate)}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3" hidden>
            <label> Total : </label>
            <input
              type="text"
              className="form-control w-50"
              value={formatCurrency(stats.total)}
              disabled
            />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Save
            </button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </>
  );
}

export default Bonus;
