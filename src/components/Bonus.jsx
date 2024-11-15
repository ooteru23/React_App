import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Bonus() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfControl, setListOfControl] = useState([]);
  const [filteredControl, setFilteredControl] = useState([]);
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [existingBonus, setExistingBonus] = useState([]);
  const [onTime, setOnTime] = useState("");
  const [late, setLate] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [bonusComponent, setBonusComponent] = useState("");
  const [percentOnTime, setPercentOnTime] = useState("");
  const [totalOnTime, setTotalOnTime] = useState("");
  const [percentLate, setPercentLate] = useState("");
  const [totalLate, setTotalLate] = useState("");
  const [bonusOnTime, setBonusOnTime] = useState("");
  const [bonusLate, setBonusLate] = useState("");
  const [salaryDeduction] = useState("9,000,000");
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

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setCurrentMonth(selectedMonth);

    setShowTable(false);

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
      disbursement_bonus: "Paid",
    }));

    axios
      .post("http://localhost:3001/bonuses", newBonus)
      .then(() => {
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
        if (error.response && error.response.status === 409) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Error Adding Data", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.error("Error Adding Data", error);
        }
      });

    const newReport = {
      employee_name: selectedEmployee,
      month: currentMonth,
      salary_deduction: salaryDeduction,
      month_ontime: onTime,
      month_late: late,
      bonus_component: bonusComponent,
      percent_ontime: percentOnTime,
      percent_late: percentLate,
      total_ontime: totalOnTime,
      total_late: totalLate,
      bonus_ontime: bonusOnTime,
      bonus_late: bonusLate,
    };

    axios
      .post("http://localhost:3001/reports", newReport)
      .then((response) => {
        console.log("Data Added:", response.data);
      })
      .catch((error) => {
        console.error("Error Adding Data", error);
      });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    if (!currentMonth || !selectedEmployee) {
      toast.error("Please select both employee and month before calculating.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const monthKey = `month_${monthMapping[currentMonth]}`;

    const filtered = listOfControl.filter((control) => {
      const controlYear = new Date(control.createdAt).getFullYear();
      const status = control[monthKey];
      return controlYear === currentYear && status && status !== "ON PROCESS";
    });

    setFilteredControl(filtered);
    setShowTable(filtered.length > 0);

    const totalOnTime = filtered
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

    const totalLate = filtered
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

    const total = totalOnTime + totalLate;
    setTotalValue(total.toLocaleString("en-US"));

    const salaryDeduction = 9000000;
    const bonusComp = total - salaryDeduction;
    setBonusComponent(bonusComp.toLocaleString("en-US"));

    const onTimePercent =
      bonusComp > 0 ? Math.round((totalOnTime / total) * 100) : 0;
    setPercentOnTime(onTimePercent + "%");

    const TotalOnTimePercent = (onTimePercent / 100) * bonusComp;
    setTotalOnTime(TotalOnTimePercent.toLocaleString("en-US"));

    const latePercent = total > 0 ? Math.round((totalLate / total) * 100) : 0;
    setPercentLate(latePercent + "%");

    const TotalLatePercent = (latePercent / 100) * bonusComp;
    setTotalLate(TotalLatePercent.toLocaleString("en-US"));

    const bonusOnTimePercent = 15;
    const calculatedBonusOnTime =
      (bonusOnTimePercent / 100) * TotalOnTimePercent;
    setBonusOnTime(calculatedBonusOnTime.toLocaleString("en-US"));

    const bonusLatePercent = 10;
    const calculatedBonusLate = (bonusLatePercent / 100) * TotalLatePercent;
    setBonusLate(calculatedBonusLate.toLocaleString("en-US"));
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
        <div className="row mt-3" hidden={!showTable}>
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
            <label htmlFor="total_value"> Total Nilai : </label>
            <input
              type="text"
              className="form-control w-50"
              value={totalValue}
              disabled
            />
          </div>

          <div className="form-group col-md-6 mt-3">
            <label htmlFor="salary_deduction">
              Pengurang (Hitungan Gaji) :
            </label>
            <input
              type="text"
              className="form-control w-50"
              value={salaryDeduction}
              disabled
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
              value={bonusComponent}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label>Total OnTime : </label>
            <input
              type="text"
              className="form-control w-50"
              value={totalOnTime}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label>Persentase Total OnTime : </label>
            <input
              type="text"
              className="form-control w-50"
              value={percentOnTime}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Total Late : </label>
            <input
              type="text"
              className="form-control w-50"
              value={totalLate}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Persentase Total Late : </label>
            <input
              type="text"
              className="form-control w-50"
              value={percentLate}
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-3">
            <label> Bonus OnTime : </label>
            <input
              type="text"
              className="form-control w-50"
              value={bonusOnTime}
              disabled
            />
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
            <input
              type="text"
              className="form-control w-50"
              value={bonusLate}
              disabled
            />
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
