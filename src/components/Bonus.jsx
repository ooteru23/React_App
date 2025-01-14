import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Bonus() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfControl, setListOfControl] = useState([]);
  const [listOfBonus, setListOfBonus] = useState([]);
  const [listOfReport, setListOfReport] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [currentYear, setCurrentYear] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [bonusTableData, setBonusTableData] = useState([]);
  const [salaryDeduction, setSalaryDeduction] = useState(0);
  const [onTime, setOnTime] = useState(0);
  const [late, setLate] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [bonusComponent, setBonusComponent] = useState(0);
  const [percentOnTime, setPercentOnTime] = useState(0);
  const [totalOnTime, setTotalOnTime] = useState(0);
  const [percentLate, setPercentLate] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [bonusOnTime, setBonusOnTime] = useState(0);
  const [bonusLate, setBonusLate] = useState(0);
  const [total, setTotal] = useState(0);

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

  const handleAddBonus = (e) => {
    e.preventDefault();

    if (salaryDeduction === 0) {
      return;
    }

    const isAnyDataPaid = bonusTableData.some((data) =>
      listOfBonus.some(
        (bonus) =>
          bonus.client_name === data.clientName &&
          bonus.employee_name === data.employee &&
          bonus.month === data.month &&
          bonus.disbursement_bonus === "Paid"
      )
    );

    if (isAnyDataPaid) {
      toast.error("Data Already Saved", {
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

    const reportPaid = bonusTableData.some((data) =>
      listOfReport.some(
        (report) =>
          report.employee_name === data.employee && report.month === data.month
      )
    );

    if (reportPaid) {
      return;
    }

    const addToReport = bonusTableData.map((data) => ({
      employee_name: data.employee,
      month: data.month,
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
      total: total,
    }));

    axios
      .post("http://localhost:3001/reports", addToReport)
      .then((response) => {
        console.log("Data Added:", response.data);
      })
      .catch(() => {
        console.error("Error Saving Data", error);
      });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const filteredListOfBonus = listOfBonus.filter((bonus) => {
      const bonusYear = new Date(bonus.createdAt).getFullYear();
      return bonusYear === Number(currentYear, 10);
    });

    const isValidMonth = listOfControl.some((control) => {
      const monthColumnKey = `month_${monthMapping[selectedMonth]}`;
      const status = control[monthColumnKey];
      return status === "ON TIME" || status === "LATE";
    });

    if (!isValidMonth) {
      toast.error(`Status don't matched with ${selectedMonth}.`);
      return;
    }

    const employeeMatches = listOfControl.some(
      (control) =>
        selectedEmployee === control.employee1 ||
        selectedEmployee === control.employee2
    );

    if (!employeeMatches) {
      toast.error("Employees don't matched.");
      return;
    }
    const allData = listOfControl.flatMap((control) => {
      const controlYear = new Date(control.createdAt).getFullYear();
      if (controlYear !== currentYear) {
        return [];
      }

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
        !filteredListOfBonus.some(
          (bonus) =>
            bonus.client_name === data.clientName &&
            bonus.employee_name === data.employee &&
            bonus.month === data.month &&
            bonus.work_status === data.status &&
            bonus.net_value === data.netValue &&
            bonus.disbursement_bonus
        )
    );

    const filteredBonusData = filteredListOfBonus.filter(
      (bonus) =>
        bonus.employee_name === selectedEmployee &&
        bonus.month === selectedMonth &&
        bonus.disbursement_bonus
    );

    if (filteredBonusData.length === 0) {
      setBonusTableData(unmatchedData);
    } else {
      setBonusTableData(
        filteredListOfBonus.map((bonus) => ({
          clientName: bonus.client_name,
          employee: bonus.employee_name,
          month: bonus.month,
          status: bonus.work_status,
          netValue: bonus.net_value,
          disbursement_bonus: bonus.disbursement_bonus,
        }))
      );
    }

    let onTimeValue = 0;
    let lateValue = 0;
    allData.forEach((data) => {
      const isPaid = listOfBonus.some(
        (bonus) =>
          bonus.client_name === data.clientName &&
          bonus.employee_name === data.employee &&
          bonus.month === data.month &&
          bonus.disbursement_bonus === "Paid"
      );

      if (!isPaid) {
        const numericValue = Number(data.netValue.replace(/\./g, ""));
        if (data.status === "ON TIME") {
          onTimeValue += numericValue;
        } else if (data.status === "LATE") {
          lateValue += numericValue;
        }
      }
    });
    setOnTime(onTimeValue);
    setLate(lateValue);

    const totalValue = onTimeValue + lateValue;
    setTotalValue(totalValue);

    const bonusComponent =
      salaryDeduction !== 0 ? totalValue - salaryDeduction : 0;
    setBonusComponent(bonusComponent);

    const percentageOnTime = (onTimeValue / totalValue) * 100;
    setPercentOnTime(Math.round(percentageOnTime));

    const totalOnTime = (Math.round(percentageOnTime) / 100) * bonusComponent;
    setTotalOnTime(Math.round(totalOnTime));

    const percentageLate = (lateValue / totalValue) * 100;
    setPercentLate(Math.round(percentageLate));

    const totalLate = (Math.round(percentageLate) / 100) * bonusComponent;
    setTotalLate(totalLate);

    const bonusOnTime = (totalOnTime / 100) * 15;
    setBonusOnTime(Math.round(bonusOnTime));

    const bonusLate = (totalLate / 100) * 10;
    setBonusLate(bonusLate);

    const total = bonusOnTime + bonusLate;
    setTotal(total);
  };

  const tableData = bonusTableData;

  const handleSalaryDeductionChange = (e) => {
    const numericValue = e.target.value.replace(/\./g, "");
    setSalaryDeduction(numericValue);
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
              onChange={(e) => setCurrentYear(e.target.value)}
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
                  <th hidden>Nama Karyawan</th>
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
                    <td hidden>{data.employee}</td>
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
              <label htmlFor="ontime"> Bulan ON TIME : </label>
              <input
                type="text"
                className="form-control w-50"
                value={onTime.toLocaleString("id-ID")}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label htmlFor="late"> Bulan LATE : </label>
              <input
                type="text"
                className="form-control w-50"
                value={late.toLocaleString("id-ID")}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label htmlFor="total_value"> Total Nilai : </label>
              <input
                type="text"
                className="form-control w-50"
                value={totalValue.toLocaleString("id-ID")}
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
                value={Number(salaryDeduction).toLocaleString("id-ID")}
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
                value={bonusComponent.toLocaleString("id-ID")}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label className="percentOnTime">
                Persentase Total ON TIME :
              </label>
              <input
                type="text"
                className="form-control w-50"
                value={percentOnTime + "%"}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label>Total ON TIME : </label>
              <input
                type="text"
                className="form-control w-50"
                value={totalOnTime.toLocaleString("id-ID")}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Persentase Total LATE : </label>
              <input
                type="text"
                className="form-control w-50"
                value={percentLate + "%"}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Total LATE : </label>
              <input
                type="text"
                className="form-control w-50"
                value={totalLate.toLocaleString("id-ID")}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Persentase Bonus ON TIME : </label>
              <input
                type="text"
                className="form-control w-50"
                value={"15%"}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3">
              <label> Bonus ON TIME : </label>
              <input
                type="text"
                className="form-control w-50"
                value={bonusOnTime.toLocaleString("id-ID")}
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
            <div className="form-group col-md-6 mt-3">
              <label> Bonus Late : </label>
              <input
                type="text"
                className="form-control w-50"
                value={bonusLate.toLocaleString("id-ID")}
                disabled
              />
            </div>
            <div className="form-group col-md-6 mt-3" hidden>
              <label> Total : </label>
              <input
                type="text"
                className="form-control w-50"
                value={total.toLocaleString("id-ID")}
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
