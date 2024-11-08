import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Bonus() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfControl, setListOfControl] = useState([]);
  const [filteredControl, setFilteredControl] = useState([]);
  const [currentYear, setCurrentYear] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [existingBonus, setExistingBonus] = useState([]);
  const [onTime, setOnTime] = useState("");
  const [late, setLate] = useState("");

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
        setListOfControl(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  useEffect(() => {
    const monthKey = `month_${monthMapping[currentMonth]}`;
    const filtered = listOfControl.filter((control) => {
      const controlYear = new Date(control.createdAt).getFullYear();
      const status = control[monthKey];
      return controlYear === currentYear && status !== "ON PROCESS";
    });
    setFilteredControl(filtered);
  }, [listOfControl, currentYear, currentYear]);

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setCurrentMonth(selectedMonth);

    if (selectedEmployee) {
      axios
        .get(
          `http://localhost:3001/bonuses?employee_name=${selectedEmployee}&month=${selectedMonth}`
        )
        .then((response) => {
          if (response.data.length > 0) {
            setExistingBonus(response.data);
          } else {
            setExistingBonus([]);
          }
        })
        .catch((error) => {
          console.error("Error Getting Bonus Data:", error);
        });
    }
  };

  const handleAddBonus = (e) => {
    e.preventDefault();

    const newBonus = filteredControl.map((control) => ({
      employee_name: selectedEmployee,
      client_name: control.client_name,
      month: currentMonth,
      work_status: control[`month_${monthMapping[currentMonth]}`],
      net_value:
        control.employee1 === selectedEmployee
          ? control.net_value1
          : control.employee2 === selectedEmployee
          ? control.net_value2
          : "-",
      disbursement_bonus: existingBonus.length > 0 ? "Paid" : "Unpaid",
    }));

    axios
      .post("http://localhost:3001/bonuses", newBonus)
      .then((response) => {
        toast.success("Data Added Successfully!", {
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
      .catch((error) => {
        toast.error("Error Adding Data!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error Adding Data", error);
      });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const monthKey = `month_${monthMapping[currentMonth]}`;

    const totalOnTime = filteredControl
      .filter((control) => control[monthKey] === "ON TIME")
      .reduce((acc, control) => {
        const netValue =
          control.employee1 === selectedEmployee
            ? Number(control.net_value1.replace(/,/g, ""))
            : control.employee2 === selectedEmployee
            ? Number(control.net_value2.replace(/,/g, ""))
            : 0;
        return acc + netValue;
      }, 0);

    const totalLate = filteredControl
      .filter((control) => control[monthKey] === "LATE")
      .reduce((acc, control) => {
        const netValue =
          control.employee1 === selectedEmployee
            ? Number(control.net_value1.replace(/,/g, ""))
            : control.employee2 === selectedEmployee
            ? Number(control.net_value2.replace(/,/g, ""))
            : 0;
        return acc + netValue;
      }, 0);

    setOnTime(totalOnTime.toLocaleString("en-US"));
    setLate(totalLate.toLocaleString("en-US"));
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
            <select
              className="form-select"
              onChange={handleMonthChange}
              required
            >
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
                  <th hidden>Nama</th>
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
                      : "-";
                  const disbursementBonus = existingBonus.find(
                    (bonus) =>
                      bonus.client_name === control.client_name &&
                      bonus.month === currentMonth
                  )
                    ? "Paid"
                    : "Unpaid";
                  return (
                    <tr key={control.id}>
                      <td>{index + 1}</td>
                      <td hidden>{selectedEmployee}</td>
                      <td>{control.client_name}</td>
                      <td>{currentMonth}</td>
                      <td>{status}</td>
                      <td>{netValue}</td>
                      <td>{disbursementBonus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <form className="row g-3" onSubmit={handleAddBonus}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="ontime"> Bulan On Time : </label>
            <input
              type="text"
              className="form-control w-50"
              value={onTime}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="late"> Bulan Late : </label>
            <input
              type="text"
              className="form-control w-50"
              value={late}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="total_value"> Total Net Value : </label>
            <input type="text" className="form-control w-50" disabled />
          </div>

          <div className="form-group col-md-6 mt-3">
            <label htmlFor="salary_deduction">
              Pengurang (Hitungan Gaji) :
            </label>
            <input
              type="text"
              className="form-control w-50"
              value={(9000000).toLocaleString("en-US")}
              disabled
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
    </>
  );
}

export default Bonus;
