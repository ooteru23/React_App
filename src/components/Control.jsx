import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import Swal from "sweetalert2";

function Control() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfControl, setListOfControl] = useState([]);
  const [listOfClient, setListOfClient] = useState([]);
  const [filteredControl, setFilteredControl] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [currentYear, setCurrentYear] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );

  const months = [
    { key: "month_jan", name: "January" },
    { key: "month_feb", name: "February" },
    { key: "month_mar", name: "March" },
    { key: "month_apr", name: "April" },
    { key: "month_may", name: "May" },
    { key: "month_jun", name: "June" },
    { key: "month_jul", name: "July" },
    { key: "month_aug", name: "August" },
    { key: "month_sep", name: "September" },
    { key: "month_oct", name: "October" },
    { key: "month_nov", name: "November" },
    { key: "month_dec", name: "December" },
  ];

  const options = [
    { value: "ON TIME", label: "ON TIME" },
    { value: "LATE", label: "LATE" },
  ];

  const handleSelectChange = (control, monthKey, selectedOption) => {
    control[monthKey] = selectedOption ? selectedOption.value : "ON PROCESS";
    setFilteredControl([...filteredControl]);
  };

  const renderMonthDropdowns = (control) => {
    const currentMonthIndex = months.findIndex(
      (month) => month.name === currentMonth
    );

    return months.slice(0, currentMonthIndex + 1).map((month) => {
      const monthValue = control[month.key];

      return (
        <td key={month.key} style={{ minWidth: "110px" }}>
          {isEditing && monthValue === "ON PROCESS" ? (
            <Select
              options={options}
              value={{
                value: monthValue,
                label: monthValue,
              }}
              onChange={(selectedOption) =>
                handleSelectChange(control, month.key, selectedOption)
              }
              placeholder="Select"
              styles={{
                control: (base) => ({
                  ...base,
                  minWidth: "110px",
                }),
              }}
            />
          ) : (
            <span>{monthValue}</span>
          )}
        </td>
      );
    });
  };

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/clients/")
      .then((response) => {
        setListOfClient(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
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
      .get("http://localhost:3001/controls/adjusted-data/")
      .then((response) => {
        setListOfControl(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:3001/controls/update-data", filteredControl)
          .then((response) => {
            console.log("Data Added:", response.data);
            setIsEditing(false);
          })
          .catch((error) => {
            toast.error("Failed to save data. Please try again.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.error("Error saving data:", error);
          });
        Swal.fire({
          title: "Saved!",
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
      }
    });
  };

  const handleCheckData = (e) => {
    e.preventDefault();

    const filtered = listOfControl
      .filter((control) => {
        const client = listOfClient.find(
          (client) => client.client_name === control.client_name
        );
        return client && client.client_status === "Active";
      })
      .filter((control) => {
        const controlYear = new Date(control.createdAt).getFullYear();
        const isEmployeeMatch =
          !selectedEmployee ||
          control.employee1 === selectedEmployee ||
          control.employee2 === selectedEmployee;
        const isYearMatch = controlYear === Number(currentYear, 10);

        return isEmployeeMatch && isYearMatch;
      });

    setFilteredControl(filtered);
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Tabel Kontrol Project</h3>
        <form className="row g-3" onSubmit={handleCheckData}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="employee_name"> Nama Karyawan </label>
            <select
              name="employee_name"
              className="form-select"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              required
            >
              <option value="" hidden>
                ---Please Choose Options---
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
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Check Data
            </button>
            <ToastContainer />
          </div>
        </form>
        <br />
        <div className="row mt-3 table-responsive">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>Nomor</th>
                  <th>Nama Klien</th>
                  <th>January</th>
                  <th>February</th>
                  <th>March</th>
                  <th>April</th>
                  <th>May</th>
                  <th>June</th>
                  <th>July</th>
                  <th>August</th>
                  <th>September</th>
                  <th>October</th>
                  <th>November</th>
                  <th>December</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {filteredControl.map((control, index) => {
                  return (
                    <tr key={control.id}>
                      <td>{index + 1}</td>
                      <td>{control.client_name}</td>
                      {renderMonthDropdowns(control)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <form className="row g-3" onSubmit={handleSave}>
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

export default Control;
