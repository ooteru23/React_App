import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Control() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfControl, setListOfControl] = useState([]);
  const [filteredControl, setFilteredControl] = useState([]);
  const [currentYear, setCurrentYear] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const navigate = useNavigate();
  const location = useLocation();

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
        setFilteredControl(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  useEffect(() => {
    if (location.state && location.state.message) {
      toast.success(location.state.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate(".", { replace: true, state: {} });
    }
  }, [location]);

  const handleCheckData = (e) => {
    e.preventDefault();

    const filtered = listOfControl.filter((control) => {
      const controlYear = new Date(control.createdAt).getFullYear();
      const isEmployeeMatch =
        control.employee1 === selectedEmployee ||
        control.employee2 === selectedEmployee;
      const isYearMatch = controlYear === currentYear;

      return (!selectedEmployee || isEmployeeMatch) && isYearMatch;
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
              <option hidden>---Please Choose Options---</option>
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
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Check Data
            </button>
            <ToastContainer />
          </div>
        </form>
        <br />
        <div className="row mt-3">
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
                      <td>{control.month_jan}</td>
                      <td>{control.month_feb}</td>
                      <td>{control.month_mar}</td>
                      <td>{control.month_apr}</td>
                      <td>{control.month_may}</td>
                      <td>{control.month_jun}</td>
                      <td>{control.month_jul}</td>
                      <td>{control.month_aug}</td>
                      <td>{control.month_sep}</td>
                      <td>{control.month_oct}</td>
                      <td>{control.month_nov}</td>
                      {currentMonth === "December" && (
                        <td>{control.month_dec}</td>
                      )}
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

export default Control;
