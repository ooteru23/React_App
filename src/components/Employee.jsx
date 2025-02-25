import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

function Employee() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [name, setName] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [status, setStatus] = useState("");
  const [salary, setSalary] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();

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
    if (location.state && location.state.message) {
      Swal.fire({
        title: location.state.message,
        icon: "success",
      });

      navigate(".", { replace: true, state: {} });
    }
  }, [location]);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmployee = {
      name: name,
      job_title: job_title,
      status: status,
      salary: salary,
    };

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
          .post("http://localhost:3001/employees", newEmployee)
          .then((response) => {
            console.log("Data Added:", response.data);
          })
          .catch((error) => {
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

  const handleDelete = (id) => {
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
          .delete(`http://localhost:3001/employees/${id}`)
          .then((response) => {
            setListOfEmployee(
              listOfEmployee.filter((employee) => employee.id !== id)
            );
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
        Swal.fire({
          title: "Deleted!",
          icon: "success",
        });
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/employee/edit/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const filteredEmployee = listOfEmployee
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        employee.job_title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        employee.status.toLowerCase().includes(searchFilter.toLowerCase()) ||
        employee.salary.toLowerCase().includes(searchFilter.toLowerCase())
    )
    .sort((a, b) => {
      if (a.status === "Inactive" && b.status !== "Inactive") return 1;
      if (a.status !== "Inactive" && b.status === "Inactive") return -1;
      return 0;
    });

  const paginatedEmployee = filteredEmployee.slice(
    (page - 1) * limit,
    page * limit
  );

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    const input = e.target.value.replace(/\./g, "");
    const formattedNumber = formatNumber(input);
    setSalary(formattedNumber);
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Tabel Karyawan</h3>
        <form className="row g-3" onSubmit={handleAddEmployee}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="name"> Nama </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="job_title"> Pekerjaan </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Job Title"
              value={job_title}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="status"> Status </label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="" hidden>
                --Please Choose Option--
              </option>
              <option>Full Time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="salary"> Gaji </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Salary"
              value={salary}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Add Data
            </button>
            <ToastContainer />
          </div>
        </form>
        <br />

        <form>
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            autoComplete="off"
            value={searchFilter}
            onChange={handleSearchChange}
          />
        </form>

        <div className="row mt-3 table-responsive">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>Nomor</th>
                  <th>Nama</th>
                  <th>Nama Job</th>
                  <th>Status</th>
                  <th>Gaji</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {paginatedEmployee.map((employee, index) => {
                  return (
                    <tr key={employee.id}>
                      <td>{index + 1}</td>
                      <td>{employee.name}</td>
                      <td>{employee.job_title}</td>
                      <td>{employee.status}</td>
                      <td>{employee.salary}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(employee.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Employees */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(filteredEmployee.length / limit)}
              </span>
              <button
                className="btn btn-primary"
                disabled={page >= Math.ceil(filteredEmployee.length / limit)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Employee;
