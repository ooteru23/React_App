import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function EditEmployee() {
  const { id } = useParams();
  const [listOfEmployee, setListOfEmployee] = useState({
    id: id,
    name: "",
    job_title: "",
    status: "",
    salary: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/employees/${id}`)
      .then((response) => {
        setListOfEmployee({
          ...listOfEmployee,
          name: response.data.name,
          job_title: response.data.job_title,
          status: response.data.status,
          salary: response.data.salary,
        });
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3001/employees/${id}`, listOfEmployee)
      .then((response) => {
        navigate("/employee");
        console.log("Data Edited:", response.data);
      })
      .catch((error) => {
        console.error("Error Updating Data:", error);
      });
  };

  // Untuk menambahkan "," setelah 3 digit
  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Edit Tabel Karyawan</h3>
        <form className="row g-3" onSubmit={handleUpdate}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="name"> Nama </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Your Name"
              value={listOfEmployee.name}
              onChange={(e) =>
                setListOfEmployee({ ...listOfEmployee, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="job_title"> Nama Job </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Your Job Title"
              value={listOfEmployee.job_title}
              onChange={(e) =>
                setListOfEmployee({
                  ...listOfEmployee,
                  job_title: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="status"> Status </label>
            <select
              className="form-select"
              value={listOfEmployee.status}
              onChange={(e) =>
                setListOfEmployee({ ...listOfEmployee, status: e.target.value })
              }
              required
            >
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
              placeholder="Insert Your Salary"
              value={listOfEmployee.salary}
              onChange={(e) => {
                const input = e.target.value.replace(/,/g, "");
                const formattedNumber = formatNumber(input);
                setListOfEmployee({
                  ...listOfEmployee,
                  salary: formattedNumber,
                });
              }}
              required
            />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Edit Data
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditEmployee;
