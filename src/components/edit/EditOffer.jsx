import React, { useState, useEffect } from "react";
import { getById as getOfferById, update as updateOffer } from "../../services/offersApi";
import { create as createClient } from "../../services/clientsApi";
import { list as listEmployees } from "../../services/employeesApi";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

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
  const [initialStatus, setInitialStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    listEmployees()
      .then((rows) => {
        setListOfEmployee(rows);
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error);
      });
  }, []);

  useEffect(() => {
    getOfferById(id)
      .then((data) => {
        setCreatorName(data.creator_name);
        setClientCandidate(data.client_candidate);
        setMarketingName(data.marketing_name);
        setAddress(data.address);
        setDate(data.date);
        setValidDate(data.valid_date);
        setPic(data.pic);
        setTelephone(data.telephone);
        setService(data.service);
        setPeriodTime(data.period_time);
        setPrice(data.price);
        setInformation(data.information);
        setOfferStatus(data.offer_status);
        setInitialStatus(data.offer_status);
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

    const submitUpdate = async () => {
      try {
        await updateOffer(id, updatedOffer);

        if (
          updatedOffer.offer_status === "Accepted" &&
          initialStatus !== "Accepted"
        ) {
          try {
            await createClient({
              client_name: client_candidate,
              address,
              pic,
              telephone,
              service,
              contract_value: price,
              client_status: "Active",
            });
          } catch (error) {
            console.error("Error creating client from offer:", error);
            toast.error("Gagal membuat client dari penawaran.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        }

        navigate("/offer", {
          state: { message: "Updated!" },
        });
        console.log("Data Updated");
      } catch (error) {
        toast.error("Error Updating Data!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error Updating Data:", error);
      }
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
        submitUpdate();
      }
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
