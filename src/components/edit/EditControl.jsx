import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function EditControl() {
  const { id } = useParams();
  const [month_jan, setMonthJan] = useState();
  const [month_feb, setMonthFeb] = useState();
  const [month_mar, setMonthMar] = useState();
  const [month_apr, setMonthApr] = useState();
  const [month_may, setMonthMay] = useState();
  const [month_jun, setMonthJun] = useState();
  const [month_jul, setMonthJul] = useState();
  const [month_aug, setMonthAug] = useState();
  const [month_sep, setMonthSep] = useState();
  const [month_oct, setMonthOct] = useState();
  const [month_nov, setMonthNov] = useState();
  const [month_dec, setMonthDec] = useState();
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/controls/${id}`)
      .then((response) => {
        setMonthJan(response.data.month_jan);
        setMonthFeb(response.data.month_feb);
        setMonthMar(response.data.month_mar);
        setMonthApr(response.data.month_apr);
        setMonthMay(response.data.month_may);
        setMonthJun(response.data.month_jun);
        setMonthJul(response.data.month_jul);
        setMonthAug(response.data.month_aug);
        setMonthSep(response.data.month_sep);
        setMonthOct(response.data.month_oct);
        setMonthNov(response.data.month_nov);
        setMonthDec(response.data.month_dec);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, [id]);

  const handleUpdateControl = (e) => {
    e.preventDefault();
    const updatedControl = {
      month_jan,
      month_feb,
      month_mar,
      month_apr,
      month_may,
      month_jun,
      month_jul,
      month_aug,
      month_sep,
      month_oct,
      month_nov,
      month_dec,
    };
    axios
      .put(`http://localhost:3001/controls/${id}`, updatedControl)
      .then((response) => {
        navigate("/project-control", {
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

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Edit Tabel Kontrol Project</h3>
        <form className="row g-3" onSubmit={handleUpdateControl}>
          {currentMonth === 0 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_jan"> January </label>
              <select
                className="form-select"
                value={month_jan}
                onChange={(e) => setMonthJan(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 1 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_feb"> February </label>
              <select
                className="form-select"
                value={month_feb}
                onChange={(e) => setMonthFeb(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 2 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_mar"> March </label>
              <select
                className="form-select"
                value={month_mar}
                onChange={(e) => setMonthMar(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 3 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_apr"> April </label>
              <select
                className="form-select"
                value={month_apr}
                onChange={(e) => setMonthApr(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 4 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_may"> May </label>
              <select
                className="form-select"
                value={month_may}
                onChange={(e) => setMonthMay(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 5 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_jun"> June </label>
              <select
                className="form-select"
                value={month_jun}
                onChange={(e) => setMonthJun(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 6 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_jul"> July </label>
              <select
                className="form-select"
                value={month_jul}
                onChange={(e) => setMonthJul(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 7 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_aug"> August </label>
              <select
                className="form-select"
                value={month_aug}
                onChange={(e) => setMonthAug(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 8 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_sep"> September </label>
              <select
                className="form-select"
                value={month_sep}
                onChange={(e) => setMonthSep(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 9 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_oct"> October </label>
              <select
                className="form-select"
                value={month_oct}
                onChange={(e) => setMonthOct(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 10 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_nov"> November </label>
              <select
                className="form-select"
                value={month_nov}
                onChange={(e) => setMonthNov(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
          {currentMonth === 11 && (
            <div className="form-group col-md-6 mt-1">
              <label htmlFor="month_dec"> December </label>
              <select
                className="form-select"
                value={month_dec}
                onChange={(e) => setMonthDec(e.target.value)}
                required
              >
                <option hidden>ON PROCESS</option>
                <option>ON TIME</option>
                <option>LATE</option>
              </select>
            </div>
          )}
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

export default EditControl;
