import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function EditOffer() {
  const { id } = useParams();
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [creator_name, setCreatorName] = useState("");
  const [client_candidate, setClientCandidate] = useState("");
  const [marketing_name, setMarketingName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [valid_date, setValidDate] = useState("");
  const [pic, setPic] = useState("");
  const [telephone, setTelephone] = useState("");
  const [service, setService] = useState("");
  const [period_time, setPeriodTime] = useState("");
  const [price, setPrice] = useState("");
  const [information, setInformation] = useState("");
  const [offer_status, setOfferStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/employees")
      .then((response) => {
        setListOfEmployee(response.data);
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/offers/${id}`)
      .then((response) => {
        setCreatorName(response.data.creator_name);
        setClientCandidate(response.data.client_candidate);
        setMarketingName(response.data.marketing_name);
        setAddress(response.data.address);
        setDate(response.data.date);
        setValidDate(response.data.valid_date);
        setPic(response.data.pic);
        setTelephone(response.data.telephone);
        setService(response.data.service);
        setPeriodTime(response.data.period_time);
        setPrice(response.data.price);
        setInformation(response.data.information);
        setOfferStatus(response.data.offer_status);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, [id]);

  const handleUpdateOffer = (e) => {
    e.preventDefault();
    const updatedOffer = {
      creator_name,
      client_candidate,
      marketing_name,
      address,
      date,
      valid_date,
      pic,
      telephone,
      service,
      period_time,
      price,
      information,
      offer_status,
    };
    axios
      .put(`http://localhost:3001/offers/${id}`, updatedOffer)
      .then((response) => {
        navigate("/offer", {
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
    setPrice(formattedNumber);
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Edit Penawaran</h3>
        <form className="row g-3" onSubmit={handleUpdateOffer}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="creator_name"> Nama Kreator </label>
            <select
              className="form-select"
              value={creator_name}
              onChange={(e) => setCreatorName(e.target.value)}
              required
            >
              {listOfEmployee.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="client_candidate"> Kandidat Klien</label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Client Candidate"
              value={client_candidate}
              onChange={(e) => setClientCandidate(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="marketing_name"> Nama Marketing</label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Marketing"
              value={marketing_name}
              onChange={(e) => setMarketingName(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="address"> Alamat </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="date"> Tanggal Penawaran</label>
            <input
              type="date"
              className="form-control"
              placeholder="Insert Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="valid_date"> Tanggal Berlaku </label>
            <input
              type="date"
              className="form-control"
              placeholder="Insert Valid Date"
              value={valid_date}
              onChange={(e) => setValidDate(e.target.value)}
              required
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="pic"> PIC Klien </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert PIC"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="telephone"> Nomor Telepon </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert HP/Tel Number"
              pattern="[0-9]{5,12}"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="service"> Jasa </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="period_time"> Periode </label>
            <input
              type="month"
              className="form-control"
              placeholder="Insert Period Time"
              value={period_time}
              onChange={(e) => setPeriodTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="price"> Harga </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Price"
              value={price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="information"> Informasi Tambahan </label>
            <input
              type="text"
              className="form-control"
              placeholder="Insert Information"
              value={information}
              onChange={(e) => setInformation(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="offer_status"> Status Penawaran </label>
            <select
              className="form-select"
              value={offer_status}
              onChange={(e) => setOfferStatus(e.target.value)}
              required
            >
              <option hidden>ON PROCESS</option>
              <option>Accepted</option>
              <option>Rejected</option>
              <option>Nothing</option>
            </select>
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
export default EditOffer;
