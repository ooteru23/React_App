import React, { useMemo, useState, useEffect } from "react";
import {
  list as listBonuses,
  create as createBonus,
  remove as deleteBonus,
} from "../services/bonusesApi";
import { create as createReport } from "../services/reportsApi";
import { ToastContainer } from "react-toastify";
import { parseCurrency, formatCurrency } from "../utils/currency";
import { createBonusKey } from "../utils/bonusKeys";
import {
  STATUS,
  DISBURSEMENT,
  CLIENT_STATUS,
  MONTHS,
} from "../utils/constants";
import { computeStats } from "../utils/bonusStats";
import { useBonusData } from "../hooks/useBonusData";
import { useBonusRows } from "../hooks/useBonusRows";
import { useBonusStats } from "../hooks/useBonusStats";
import BonusFilters from "./bonus/BonusFilters";
import BonusTable from "./bonus/BonusTable";
import BonusSummary from "./bonus/BonusSummary";
import { notify } from "../utils/notify";

const resolveYear = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? new Date().getFullYear() : parsed;
};

// helpers moved to utils: currency, bonusKeys

function Bonus() {
  const { employees, controls, setups, clients, bonuses, setBonuses } =
    useBonusData();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear().toString()
  );
  const [salaryDeduction, setSalaryDeduction] = useState("");
  const [bonusRows, setBonusRows] = useState([]);
  const [page, setPage] = useState(1);

  const limit = 5;

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.status !== CLIENT_STATUS.INACTIVE),
    [employees]
  );

  const yearNumber = useMemo(() => resolveYear(currentYear), [currentYear]);

  const { availableMonthNames, calculateRows } = useBonusRows({
    controls,
    setups,
    clients,
    bonuses,
    selectedEmployee,
    selectedMonth,
    yearNumber,
  });


  // availableMonthNames now comes from useBonusRows

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

  const stats = useBonusStats(bonusRows, salaryDeductionNumber);

  const handleCalculate = (event) => {
    event.preventDefault();

    if (!selectedEmployee || !selectedMonth) {
      notify.warning("Pilih karyawan dan bulan terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const monthDefinition = MONTHS.find(
      (month) => month.name === selectedMonth
    );

    if (!monthDefinition) {
      notify.error("Bulan yang dipilih tidak valid.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!hasAvailableMonths) {
      notify.info("Belum ada data kontrol dengan status ON TIME atau LATE.", {
        position: "top-right",
        autoClose: 3000,
      });
      setBonusRows([]);
      return;
    }

    if (!availableMonthNames.has(monthDefinition.name)) {
      notify.info("Belum ada data kontrol ON TIME atau LATE untuk bulan ini.", {
        position: "top-right",
        autoClose: 3000,
      });
      setBonusRows([]);
      return;
    }

    const nextRows = calculateRows();

    if (nextRows.length === 0) {
      notify.info("Tidak ada data bonus yang memenuhi kriteria.", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setBonusRows(nextRows);
    setPage(1);
  };

  const handleAddBonus = async (event) => {
    event.preventDefault();

    if (bonusRows.length === 0) {
      notify.info("Tidak ada data bonus untuk disimpan.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (salaryDeductionNumber <= 0) {
      notify.warning("Hitung Pengurang (Hitungan Gaji) terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const rowsToSave = bonusRows.filter(
      (row) =>
        !row.isPersisted && row.disbursement_bonus === DISBURSEMENT.UNPAID
    );

    if (rowsToSave.length === 0) {
      notify.info("Data bonus sudah ada.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const confirmed = await notify.confirm();
    if (!confirmed) {
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
            employee_name: row.employee,
            disbursement_bonus: DISBURSEMENT.PAID,
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
            ? {
                ...row,
                isPersisted: true,
                disbursement_bonus: DISBURSEMENT.PAID,
              }
            : row
        )
      );

      const latestBonuses = await listBonuses();
      setBonuses(latestBonuses);

      const paidBonuses = latestBonuses.filter((bonus) => {
        if (bonus.disbursement_bonus !== DISBURSEMENT.PAID) {
          return false;
        }

        const bonusYear = bonus.createdAt
          ? new Date(bonus.createdAt).getFullYear()
          : yearNumber;

        return (
          bonus.employee_name === selectedEmployee &&
          bonus.month === selectedMonth &&
          bonusYear === yearNumber
        );
      });

      if (paidBonuses.length > 0) {
        const normalizedRows = paidBonuses.map((bonus) => ({
          workStatus: bonus.work_status,
          netValueNumber: parseCurrency(bonus.net_value),
          disbursement_bonus: DISBURSEMENT.PAID,
        }));

        const paidStats = computeStats(normalizedRows, salaryDeductionNumber);

        try {
          await createReport({
            employee_name: selectedEmployee,
            month: selectedMonth,
            salary_deduction: salaryDeductionNumber.toString(),
            month_ontime: paidStats.onTimeValue.toString(),
            month_late: paidStats.lateValue.toString(),
            bonus_component: paidStats.bonusComponent.toString(),
            percent_ontime: paidStats.percentOnTime.toString(),
            percent_late: paidStats.percentLate.toString(),
            total_ontime: paidStats.totalOnTime.toString(),
            total_late: paidStats.totalLate.toString(),
            bonus_ontime: paidStats.bonusOnTime.toString(),
            bonus_late: paidStats.bonusLate.toString(),
            total: paidStats.total.toString(),
          });
        } catch (reportError) {
          console.error("Error saving report data:", reportError);
        }
      }

      notify.success("Data bonus berhasil disimpan.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error saving bonus data:", error);
      notify.error("Gagal menyimpan data bonus.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteBonus = async () => {
    if (!selectedEmployee || !selectedMonth) {
      notify.warning("Pilih karyawan dan bulan terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const persistedRows = bonusRows.filter(
      (row) =>
        row.employee === selectedEmployee &&
        row.month === selectedMonth &&
        row.isPersisted
    );

    if (persistedRows.length === 0) {
      notify.info("Tidak ada data bonus yang cocok untuk dihapus.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const targetYear = yearNumber;
    const yearMatchedBonuses = bonuses.filter((bonus) => {
      const bonusYear = bonus.createdAt
        ? new Date(bonus.createdAt).getFullYear()
        : targetYear;
      return bonusYear === targetYear;
    });

    const remainingBonuses = [...yearMatchedBonuses];
    const idsToDelete = [];

    persistedRows.forEach((row) => {
      const normalizedValue = parseCurrency(row.netValue);
      const candidateIndex = remainingBonuses.findIndex((bonus) => {
        const valueMatch = parseCurrency(bonus.net_value) === normalizedValue;
        const employeeMatch = bonus.employee_name
          ? bonus.employee_name === row.employee
          : true;

        return (
          bonus.client_name === row.clientName &&
          bonus.month === row.month &&
          valueMatch &&
          employeeMatch
        );
      });

      if (candidateIndex >= 0) {
        const [matched] = remainingBonuses.splice(candidateIndex, 1);
        if (matched?.id != null) {
          idsToDelete.push(matched.id);
        }
      }
    });

    if (idsToDelete.length === 0) {
      notify.info("Tidak ada data bonus yang cocok untuk dihapus.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const confirmed = await notify.confirm({ title: "Hapus data bonus?" });
    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(idsToDelete.map((id) => deleteBonus(id)));

      const latestBonuses = await listBonuses();
      setBonuses(latestBonuses);

      setBonusRows((prev) =>
        prev.map((row) =>
          row.employee === selectedEmployee && row.month === selectedMonth
            ? {
                ...row,
                isPersisted: false,
                disbursement_bonus: DISBURSEMENT.UNPAID,
              }
            : row
        )
      );

      notify.success("Data bonus berhasil dihapus.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting bonus data:", error);
      notify.error("Gagal menghapus data bonus.", {
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
        <BonusFilters
          employees={activeEmployees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          onCalculate={handleCalculate}
          onDelete={handleDeleteBonus}
        />
        <br />
        <BonusTable
          paginatedBonus={paginatedBonus}
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
        />
        <BonusSummary
          stats={stats}
          salaryDeductionNumber={salaryDeductionNumber}
          onSalaryDeductionChange={handleSalaryDeductionChange}
          onSave={handleAddBonus}
        />
        <ToastContainer />
      </div>
    </>
  );
}

export default Bonus;
