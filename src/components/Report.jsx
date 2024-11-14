import React, { useState, useEffect } from "react";
import axios from "axios";

function Report() {
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" })
  );
  const [listOfReport, setListOfReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showTable, setShowTable] = useState(false);

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
    axios
      .get("http://localhost:3001/reports")
      .then((response) => {
        setListOfReport(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, [currentYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setShowTable(false);
  };

  const handleViewReport = (e) => {
    e.preventDefault();

    const filteredByYear = listOfReport.filter(
      (report) => new Date(report.createdAt).getFullYear() === currentYear
    );

    if (selectedMonth === currentMonth) {
      const filteredByMonth = filteredByYear.filter(
        (report) => report.month === monthMapping[selectedMonth]
      );
      setFilteredReport(filteredByMonth);
      setShowTable(true);
    } else {
      setFilteredReport([]);
      setShowTable(false);
    }

    const reportTotal = filteredByYear.map((report) => ({
      ...report,
      totalBonus: (
        (parseInt(report.bonus_ontime.replace(/,/g, "")) || 0) +
        (parseInt(report.bonus_late.replace(/,/g, "")) || 0)
      ).toLocaleString("en-US"),
    }));
    setFilteredReport(reportTotal);
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
              onChange={handleMonthChange}
              required
            >
              <option hidden>---Please Choose Options---</option>
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
              disabled
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
                {filteredReport.map((report, index) => {
                  return (
                    <tr key={report.id}>
                      <td>{index + 1}</td>
                      <td>{report.employee_name}</td>
                      <td>{report.salary_deduction}</td>
                      <td>{report.month_ontime}</td>
                      <td>{report.month_late}</td>
                      <td>{report.bonus_component}</td>
                      <td>{report.percent_ontime}</td>
                      <td>{report.percent_late}</td>
                      <td>{report.total_ontime}</td>
                      <td>{report.total_late}</td>
                      <td>{report.bonus_ontime}</td>
                      <td>{report.bonus_late}</td>
                      <td>{report.totalBonus}</td>
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
