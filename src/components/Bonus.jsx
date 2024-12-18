import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Bonus() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfControl, setListOfControl] = useState([]);
  const [listOfBonus, setListOfBonus] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [currentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [bonusTableData, setBonusTableData] = useState([]);
  const [salaryDeduction, setSalaryDeduction] = useState("");

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
      .get("http://localhost:3001/employees")
      .then((response) => {
        setListOfEmployee(response.data);
        const activeEmployees = response.data.filter(
          (employee) => employee.status !== "Inactive"
        );
        setFilteredEmployee(activeEmployees);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/controls")
      .then((response) => {
        setListOfControl(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
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

  const handleAddBonus = (e) => {
    e.preventDefault();

    const addToBonus = bonusTableData.map((data) => ({
      employee_name: data.employee,
      client_name: data.clientName,
      month: data.month,
      work_status: data.status,
      net_value: data.netValue,
      disbursement_bonus: "Paid",
    }));

    axios
      .post("http://localhost:3001/bonuses", addToBonus)
      .then((response) => {
        toast.success("Data Saved Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => window.location.reload(),
        });
        console.log("Data Added:", response.data);
      })
      .catch(() => {
        toast.error("Error Saving Data", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error Saving Data", error);
      });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const isValidMonth = listOfControl.some((control) => {
      const monthColumnKey = `month_${monthMapping[selectedMonth]}`;
      const status = control[monthColumnKey];
      return status === "ON TIME" || status === "LATE";
    });

    if (!isValidMonth) {
      toast.error(`Tidak ada status yang cocok dengan ${selectedMonth}.`);
      return;
    }

    const employeeMatches = listOfControl.some(
      (control) =>
        selectedEmployee === control.employee1 ||
        selectedEmployee === control.employee2
    );

    if (!employeeMatches) {
      toast.error("Tidak ada Nama Karyawan yang cocok.");
      return;
    }

    const allData = listOfControl.flatMap((control) => {
      return Object.keys(monthMapping).flatMap((month) => {
        const monthColumnKey = `month_${monthMapping[month]}`;
        const status = control[monthColumnKey];
        if (status === "ON TIME" || status === "LATE") {
          const matchedEmployee =
            selectedEmployee === control.employee1
              ? control.employee1
              : selectedEmployee === control.employee2
              ? control.employee2
              : "";

          const netValue =
            selectedEmployee === control.employee1
              ? control.net_value1
              : selectedEmployee === control.employee2
              ? control.net_value2
              : "";

          return {
            clientName: control.client_name,
            employee: matchedEmployee,
            month,
            status,
            netValue,
            disbursement_bonus: "Unpaid",
          };
        }
        return [];
      });
    });

    const unmatchedData = allData.filter(
      (data) =>
        !listOfBonus.some(
          (bonus) =>
            bonus.client_name === data.clientName &&
            bonus.month === data.month &&
            bonus.disbursement_bonus
        )
    );

    const filteredBonusData = listOfBonus.filter(
      (bonus) =>
        bonus.employee_name === selectedEmployee &&
        bonus.month === selectedMonth &&
        bonus.disbursement_bonus
    );

    if (filteredBonusData.length === 0) {
      setBonusTableData(unmatchedData);
    } else {
      setBonusTableData(
        listOfBonus.map((bonus) => ({
          clientName: bonus.client_name,
          employee: bonus.employee_name,
          month: bonus.month,
          status: bonus.work_status,
          netValue: bonus.net_value,
          disbursement_bonus: bonus.disbursement_bonus,
        }))
      );
    }
  };

  const tableData = bonusTableData;

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
              <option value="" hidden>
                --Please Choose Options--
              </option>
              {filteredEmployee.map((employee) => (
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
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              required
            >
              <option value="" hidden>
                --Please Choose Options--
              </option>
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
        <div className="row mt-3 table-responsive">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>Nomor</th>
                  <th>Nama Karyawan</th>
                  <th>Nama Klien</th>
                  <th>Bulan</th>
                  <th>Status Pekerjaan</th>
                  <th>Net Value</th>
                  <th>Status Pencairan Bonus</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.employee}</td>
                    <td>{data.clientName}</td>
                    <td>{data.month}</td>
                    <td>{data.status}</td>
                    <td>{data.netValue}</td>
                    <td>{data.disbursement_bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Input field */}
        <div className="container mt-3">
          <form className="row g-3" onSubmit={handleAddBonus}>
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="ontime"> Bulan On Time : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label htmlFor="late"> Bulan Late : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label htmlFor="total_value"> Total Nilai : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label htmlFor="salary_deduction">
                Pengurang (Hitungan Gaji) :
              </label>
              <input
                type="text"
                className="form-control w-50"
                value={salaryDeduction.toLocaleString("id-ID")}
                onChange={(e) => setSalaryDeduction(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label htmlFor="Debt_Recipient"> Hutang Penerimaan : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label htmlFor="component_bonus"> Bonus Komponen : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label>Total OnTime : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label>Persentase Total OnTime : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Total Late : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Persentase Total Late : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Bonus OnTime : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Persentase Bonus OnTime : </label>
              <input
                type="text"
                className="form-control w-50"
                value={"15%"}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Bonus Late : </label>
              <input type="text" className="form-control w-50" disabled />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Persentase Bonus Late : </label>
              <input
                type="text"
                className="form-control w-50"
                value={"10%"}
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
      </div>
    </>
  );
}

export default Bonus;
