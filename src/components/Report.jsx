import React, { useState, useEffect } from "react";
import axios from "axios";

function Report() {
  const [currentYear, setCurrentYear] = useState([]);
  const [listOfReport, setListOfReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [filteredReport, setFilteredReport] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const monthMapping = {
    January: "jan",
    February: "feb",
    March: "mar",
    April: "apr",
    May: "may",
    June: "jun",
    July: "jul",
    August: "aug",
    September: "sep",
    October: "oct",
    November: "nov",
    December: "dec",
  };

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/reports")
      .then((response) => {
        setListOfReport(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  const handleViewReport = (e) => {
    e.preventDefault();
    const seenEmployees = new Set();
    const filtered = listOfReport.filter((report) => {
      const reportYear = new Date(report.createdAt).getFullYear();
      const reportMonth = report.month;
      const employeeName = report.employee_name;

      if (
        reportMonth === selectedMonth &&
        reportYear === Number(currentYear, 10) &&
        !seenEmployees.has(employeeName)
      ) {
        seenEmployees.add(employeeName);
        return true;
      }
      return false;
    });
    setFilteredReport(filtered);
    setShowTable(true);
  };

  const paginatedReport = filteredReport.slice(
    (page - 1) * limit,
    page * limit
  );

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleCalculate(e);
    }
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Laporan Bonus</h3>
        <form
          className="row g-3"
          onSubmit={handleViewReport}
          onKeyDown={handleEnter}
        >
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="month"> Bulan </label>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              required
            >
              <option value="" hidden>
                ---Please Choose Options---
              </option>
              {Object.keys(monthMapping).map((month) => (
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
              onChange={(e) => setCurrentYear(e.target.value)}
            />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Lihat Report
            </button>
          </div>
        </form>
        <br />
        <div className="row mt-3 table-responsive" hidden={!showTable}>
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th rowSpan="2">Nomor</th>
                  <th rowSpan="2">Nama</th>
                  <th rowSpan="2">Pengurang(Hitungan Gaji)</th>
                  <th rowSpan="2">Bulan OnTime</th>
                  <th rowSpan="2">Bulan Late </th>
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
                {paginatedReport.map((report, index) => {
                  return (
                    <tr key={report.id}>
                      <td>{index + 1}</td>
                      <td>{report.employee_name}</td>
                      <td>
                        {Number(report.salary_deduction).toLocaleString(
                          "id-ID"
                        )}
                      </td>
                      <td>
                        {Number(report.month_ontime).toLocaleString("id-ID")}
                      </td>
                      <td>
                        {Number(report.month_late).toLocaleString("id-ID")}
                      </td>
                      <td>
                        {Number(report.bonus_component).toLocaleString("id-ID")}
                      </td>
                      <td>{report.percent_ontime}%</td>
                      <td>{report.percent_late}%</td>
                      <td>
                        {Number(report.total_ontime).toLocaleString("id-ID")}
                      </td>
                      <td>
                        {Number(report.total_late).toLocaleString("id-ID")}
                      </td>
                      <td>
                        {Number(report.bonus_ontime).toLocaleString("id-ID")}
                      </td>
                      <td>
                        {Number(report.bonus_late).toLocaleString("id-ID")}
                      </td>
                      <td>{Number(report.total).toLocaleString("id-ID")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Reports */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(filteredReport.length / limit)}
              </span>
              <button
                className="btn btn-primary"
                disabled={page >= Math.ceil(filteredReport.length / limit)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
