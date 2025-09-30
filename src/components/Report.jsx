import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { list as listReports } from "../services/reportsApi";
import { list as listBonuses } from "../services/bonusesApi";

const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const resolveYear = (value) => {
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? new Date().getFullYear() : parsed;
};

function Report() {
  const [currentYear, setCurrentYear] = useState(
    () => new Date().getFullYear().toString()
  );
  const [reports, setReports] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [filteredReport, setFilteredReport] = useState([]);
  const [page, setPage] = useState(1);

  const limit = 5;

  useEffect(() => {
    listReports()
      .then((rows) => setReports(rows))
      .catch((error) => console.error("Error getting reports:", error));

    listBonuses()
      .then((rows) => setBonuses(rows))
      .catch((error) => console.error("Error getting bonuses:", error));
  }, []);

  const monthOptions = useMemo(() => {
    const targetYear = resolveYear(currentYear);
    const unique = new Set();

    bonuses.forEach((bonus) => {
      if (bonus.disbursement_bonus !== "Paid") {
        return;
      }

      const bonusYear = bonus.createdAt
        ? new Date(bonus.createdAt).getFullYear()
        : targetYear;

      if (bonusYear !== targetYear) {
        return;
      }

      if (bonus.month) {
        unique.add(bonus.month);
      }
    });

    return Array.from(unique).sort(
      (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
    );
  }, [bonuses, currentYear]);

  const totalPages = Math.max(1, Math.ceil(filteredReport.length / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedReport = useMemo(
    () => filteredReport.slice((page - 1) * limit, page * limit),
    [filteredReport, page]
  );

  const handleViewReport = async (event) => {
    event.preventDefault();

    if (!selectedMonth) {
      toast.warning("Pilih bulan terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const targetYear = resolveYear(currentYear);

    let latestReports = reports;
    let latestBonuses = bonuses;

    try {
      latestReports = await listReports();
      setReports(latestReports);
    } catch (error) {
      console.error("Error refreshing reports:", error);
    }

    try {
      latestBonuses = await listBonuses();
      setBonuses(latestBonuses);
    } catch (error) {
      console.error("Error refreshing bonuses:", error);
    }

    const seenEmployees = new Set();

    const filtered = latestReports.filter((report) => {
      const reportYear = report.createdAt
        ? new Date(report.createdAt).getFullYear()
        : targetYear;

      if (report.month !== selectedMonth || reportYear !== targetYear) {
        return false;
      }

      const employeeName = report.employee_name;

      const hasPaidBonus = latestBonuses.some((bonus) => {
        if (bonus.disbursement_bonus !== "Paid") {
          return false;
        }

        const bonusYear = bonus.createdAt
          ? new Date(bonus.createdAt).getFullYear()
          : targetYear;

        return (
          bonus.employee_name === employeeName &&
          bonus.month === selectedMonth &&
          bonusYear === targetYear
        );
      });

      if (!hasPaidBonus || seenEmployees.has(employeeName)) {
        return false;
      }

      seenEmployees.add(employeeName);
      return true;
    });

    if (filtered.length === 0) {
      toast.info("Belum ada data bonus Paid untuk bulan tersebut.", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setFilteredReport(filtered);
    setShowTable(true);
    setPage(1);
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleViewReport(event);
    }
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Laporan Bonus</h3>
        <form
          className="row g-3"
          onSubmit={handleViewReport}
          onKeyDown={handleEnter}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="month"> Bulan </label>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              required>
              <option value="" hidden>
                ---Please Choose Options---
              </option>
              {monthOptions.map((month) => (
                <option key={month}>{month}</option>
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
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Lihat Report
            </button>
          </div>
        </form>
        <br />
        <div className="row mt-3" hidden={!showTable}>
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th rowSpan="2">Nomor</th>
                  <th rowSpan="2">Nama</th>
                  <th rowSpan="2">Pengurang (Hitungan Gaji)</th>
                  <th rowSpan="2">Bulan OnTime</th>
                  <th rowSpan="2">Bulan Late</th>
                  <th rowSpan="2">Bonus Komponen</th>
                  <th colSpan="2">Persentase</th>
                  <th colSpan="2">Kalkulasi Bonus</th>
                  <th colSpan="2">Bonus</th>
                  <th rowSpan="2">Total</th>
                </tr>
                <tr>
                  <th>OnTime</th>
                  <th>Late</th>
                  <th>OnTime</th>
                  <th>Late</th>
                  <th>OnTime</th>
                  <th>Late</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {paginatedReport.length === 0 ? (
                  <tr>
                    <td colSpan={12}>Tidak ada data</td>
                  </tr>
                ) : (
                  paginatedReport.map((report, index) => (
                    <tr key={report.id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{report.employee_name}</td>
                      <td>
                        {Number(report.salary_deduction).toLocaleString(
                          "en-US"
                        )}
                      </td>
                      <td>
                        {Number(report.month_ontime).toLocaleString("en-US")}
                      </td>
                      <td>
                        {Number(report.month_late).toLocaleString("en-US")}
                      </td>
                      <td>
                        {Number(report.bonus_component).toLocaleString("en-US")}
                      </td>
                      <td>{report.percent_ontime}%</td>
                      <td>{report.percent_late}%</td>
                      <td>
                        {Number(report.total_ontime).toLocaleString("en-US")}
                      </td>
                      <td>
                        {Number(report.total_late).toLocaleString("en-US")}
                      </td>
                      <td>
                        {Number(report.bonus_ontime).toLocaleString("en-US")}
                      </td>
                      <td>
                        {Number(report.bonus_late).toLocaleString("en-US")}
                      </td>
                      <td>{Number(report.total).toLocaleString("en-US")}</td>
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
            onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(filteredReport.length / limit)}
          </span>
          <button
            className="btn btn-primary"
            disabled={page >= Math.ceil(filteredReport.length / limit)}
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Report;
