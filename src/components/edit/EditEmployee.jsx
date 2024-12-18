import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function EditEmployee() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [status, setStatus] = useState("");
  const [salary, setSalary] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/employees/${id}`)
      .then((response) => {
        setName(response.data.name);
        setJobTitle(response.data.job_title);
        setStatus(response.data.status);
        setSalary(response.data.salary);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, [id]);

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    const updatedEmployee = { name, job_title, status, salary };
    axios
      .put(`http://localhost:3001/employees/${id}`, updatedEmployee)
      .then((response) => {
        navigate("/employee", {
          state: { message: "Data Updated Successfully" },
        });
        console.log("Data Updated", response.data);
      })
      .catch((error) => {
        toast.error("Error Updating Data!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error Updating Data:", error);
      });
  };

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
        <h3 className="text-center mt-3 mb-5">Edit Karyawan</h3>
        <form className="row g-3" onSubmit={handleUpdateEmployee}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="name"> Nama </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="job_title"> Nama Job </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Your Job Title"
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
              value={salary}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Edit Data
            </button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </>
  );
}

export default EditEmployee;
