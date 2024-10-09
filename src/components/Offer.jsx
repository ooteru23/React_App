import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Offer() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfOffer, setListOfOffer] = useState([]);
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
      .get("http://localhost:3001/offers")
      .then((response) => {
        setListOfOffer(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  const handleAddOffer = () => {
    const newOffer = {
      creator_name: creator_name,
      client_candidate: client_candidate,
      marketing_name: marketing_name,
      address: address,
      date: date,
      valid_date: valid_date,
      pic: pic,
      telephone: telephone,
      service: service,
      period_time: period_time,
      price: price,
      information: information,
    };
    axios
      .post("http://localhost:3001/offers", newOffer)
      .then((response) => {
        console.log("Data Added:", response.data);
      })
      .catch((error) => {
        console.error("Error Adding Data", error);
      });
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/offer/edit/${id}`);
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM DD, YYYY");
  };

  const formatMonth = (dateString) => {
    return moment(dateString).format("MMMM YYYY");
  };

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    const input = e.target.value.replace(/,/g, "");
    const formattedNumber = formatNumber(input);
    setPrice(formattedNumber);
  };
  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Tabel Penawaran</h3>
        <form className="row g-3" onSubmit={handleAddOffer}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="creator_name"> Nama Kreator </label>
            <select
              className="form-select"
              value={creator_name}
              onChange={(e) => setCreatorName(e.target.value)}
              required
            >
              <option hidden>--Please Choose Options--</option>
              {listOfEmployee.map((employee) => (
                <option>{employee.name}</option>
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
              type="tel"
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
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Add Data
            </button>
          </div>
        </form>
        <br />

        <form>
          <input
            type="text"
            autofocus
            placeholder="Search..."
            autocomplete="off"
          />
        </form>

        <div className="row mt-3">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead>
                <tr>
                  <th>Nama ID</th>
                  <th>Nama Kreator</th>
                  <th>Kandidat Klien</th>
                  <th>Nama Marketing</th>
                  <th>Alamat</th>
                  <th>Tanggal Penawaran</th>
                  <th>Tanggal Berlaku</th>
                  <th>PIC</th>
                  <th>Nomor Telepon</th>
                  <th>Jasa</th>
                  <th>Periode</th>
                  <th>Harga</th>
                  <th>Informasi</th>
                  <th>Status Penawaran</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listOfOffer.map((offer, index) => {
                  return (
                    <tr key={offer.id}>
                      <td>{index + 1}</td>
                      <td>{offer.creator_name}</td>
                      <td>{offer.client_candidate}</td>
                      <td>{offer.marketing_name}</td>
                      <td>{offer.address}</td>
                      <td>{formatDate(offer.date)}</td>
                      <td>{formatDate(offer.valid_date)}</td>
                      <td>{offer.pic}</td>
                      <td>{offer.telephone}</td>
                      <td>{offer.service}</td>
                      <td>{formatMonth(offer.period_time)}</td>
                      <td>{offer.price}</td>
                      <td>{offer.information}</td>
                      <td>{offer.offer_status || "ON PROCESS"}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(offer.id)}
                        >
                          Edit
                        </button>
                        <button className="btn btn-danger">Delete</button>
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

export default Offer;
