import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Bonus() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfControl, setListOfControl] = useState([]);
  const [filteredControl, setFilteredControl] = useState([]);
  const [currentYear, setCurrentYear] = useState([]);
  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedEmployee, setSelectedEmployee] = useState("");

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
      .get("http://localhost:3001/employees")
      .then((response) => {
        setListOfEmployee(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/controls")
      .then((response) => {
        const monthKey = `month_${monthMapping[currentMonth]}`;

        const filtered = response.data.filter((control) => {
          const status = control[monthKey];
          return status !== "ON PROCESS"; // Hide rows with "ON PROCESS"
        });

        setListOfControl(response.data);
        setFilteredControl(filtered);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  const handleCalculate = (e) => {
    e.preventDefault();
    const filtered = listOfControl.filter((control) => {
      const controlYear = new Date(control.createdAt).getFullYear();
      const isYearMatch = controlYear === currentYear;
      return isYearMatch;
    });
    setFilteredControl(filtered);
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Kalkulasi Bonus</h3>
        <form className="row g-3" onSubmit={handleCalculate}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="employee_name"> Nama Karyawan </label>
            <select
              className="form-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option hidden>--Please Choose Options--</option>
              {listOfEmployee.map((employee) => (
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
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="month"> Bulan </label>
            <select className="form-select" required>
              <option hidden>--Please Choose Options--</option>
              {Object.keys(monthMapping).map((month) => (
                <option key={month}>{month}</option>
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
                  <th>Nama</th>
                  <th>Nama Klien</th>
                  <th>Bulan</th>
                  <th>Status Pekerjaan</th>
                  <th>Net Value</th>
                  <th>Status Pencairan Bonus</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {filteredControl.map((control, index) => {
                  const monthKey = `month_${monthMapping[currentMonth]}`;
                  const status = control[monthKey];
                  const netValue =
                    control.employee1 === selectedEmployee
                      ? control.net_value1
                      : control.employee2 === selectedEmployee
                      ? control.net_value2
                      : "-"; // Fallback if no match
                  return (
                    <tr key={control.id}>
                      <td>{index + 1}</td>
                      <td>{selectedEmployee}</td>
                      <td>{control.client_name}</td>
                      <td>{currentMonth}</td>
                      <td>{status}</td>
                      <td>{netValue}</td>
                      <td>Unpaid</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <form className="row g-3">
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="ontime"> Bulan On Time : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="late"> Bulan Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="total_value"> Total Net Value : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="salary_deduction">
              Pengurang (Hitungan Gaji) :
            </label>
            <input type="text" className="form-control w-50" />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="Debt_Recipient"> Hutang Penerimaan : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="component_bonus"> Bonus Komponen : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label>Total OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label>Persentase Total OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Total Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Persentase Total Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Bonus OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Persentase Bonus OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Bonus Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Persentase Bonus Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Bonus;
