import React, { useState, useEffect } from "react";
import axios from "axios";

function Report() {
  const [currentYear, setCurrentYear] = useState([]);
  const [listOfReport, setListOfReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

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
      .get("http://localhost:3001/bonuses")
      .then((response) => {
        setListOfBonus(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
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
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Laporan Bonus</h3>
        <form className="row g-3" onSubmit={handleViewReport}>
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
        <div className="row mt-3 table-responsive" hidden>
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
                {listOfReport.map((report, index) => {
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
