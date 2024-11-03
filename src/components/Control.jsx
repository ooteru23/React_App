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

  const handleEdit = (id) => {
    navigate(`/project-control/edit/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/controls/${id}`)
      .then((response) => {
        toast.success("Data Deleted Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => window.location.reload(),
        });
        setListOfControl(listOfControl.filter((control) => control.id !== id));
        console.log("Data Deleted:", response.data);
      })
      .catch((error) => {
        toast.error("Error Deleting Data!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error Deleting Data:", error);
      });
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
                  <th>Karyawan 1</th>
                  <th>Karyawan 2</th>
                  <th>NetValue 1</th>
                  <th>NetValue 2</th>
                  {currentMonth === "January" && <th>January</th>}
                  {currentMonth === "February" && <th>February</th>}
                  {currentMonth === "March" && <th>March</th>}
                  {currentMonth === "April" && <th>April</th>}
                  {currentMonth === "May" && <th>May</th>}
                  {currentMonth === "June" && <th>June</th>}
                  {currentMonth === "July" && <th>July</th>}
                  {currentMonth === "August" && <th>August</th>}
                  {currentMonth === "September" && <th>September</th>}
                  {currentMonth === "October" && <th>October</th>}
                  {currentMonth === "November" && <th>November</th>}
                  {currentMonth === "December" && <th>December</th>}
                  <th>Status Pencairan Bonus</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {filteredControl.map((control, index) => {
                  return (
                    <tr key={control.id}>
                      <td>{index + 1}</td>
                      <td>{control.client_name}</td>
                      <td>{control.employee1}</td>
                      <td>{control.employee2}</td>
                      <td>{control.net_value1}</td>
                      <td>{control.net_value2}</td>
                      {currentMonth === "January" && (
                        <td>{control.month_jan}</td>
                      )}
                      {currentMonth === "February" && (
                        <td>{control.month_feb}</td>
                      )}
                      {currentMonth === "March" && <td>{control.month_mar}</td>}
                      {currentMonth === "April" && <td>{control.month_apr}</td>}
                      {currentMonth === "May" && <td>{control.month_may}</td>}
                      {currentMonth === "June" && <td>{control.month_jun}</td>}
                      {currentMonth === "July" && <td>{control.month_jul}</td>}
                      {currentMonth === "August" && (
                        <td>{control.month_aug}</td>
                      )}
                      {currentMonth === "September" && (
                        <td>{control.month_sep}</td>
                      )}
                      {currentMonth === "October" && (
                        <td>{control.month_oct}</td>
                      )}
                      {currentMonth === "November" && (
                        <td>{control.month_nov}</td>
                      )}
                      {currentMonth === "December" && (
                        <td>{control.month_dec}</td>
                      )}
                      <td>{control.disbursement_bonus}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(control.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(control.id)}
                        >
                          Delete
                        </button>
                      </td>
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
