import React, { useState, useEffect } from "react";
import {
  list as listOffers,
  create as createOffer,
  remove as removeOffer,
} from "../services/offersApi";
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";
import { list as listEmployees } from "../services/employeesApi";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { formatWithComma, sanitizeDigits } from "../utils/numberFormat";

function Offer() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
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
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();

  const formatDateValue = (value, pattern) => {
    if (!value) {
      return "";
    }

    let parsedValue = value;

    if (typeof value === "string") {
      const normalizedValue = /^\d{4}-\d{2}$/.test(value)
        ? `${value}-01`
        : value;

      parsedValue = parseISO(normalizedValue);
    } else if (!(value instanceof Date)) {
      parsedValue = new Date(value);
    }

    if (isValid(parsedValue)) {
      return format(parsedValue, pattern, { locale: id });
    }

    return typeof value === "string" ? value : String(value);
  };

  useEffect(() => {
    listEmployees()
      .then((rows) => {
        setListOfEmployee(rows);
        const activeEmployees = rows.filter(
          (employee) => employee.status !== "Inactive"
        );
        setFilteredEmployee(activeEmployees);
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error);
      });
  }, []);

  useEffect(() => {
    listOffers()
      .then((rows) => {
        setListOfOffer(rows);
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

  const handleAddOffer = (e) => {
    e.preventDefault();
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

    Swal.fire({
      title: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        createOffer(newOffer)
          .then((created) => {
            setListOfOffer((prev) => [...prev, created]);
            setCreatorName("");
            setClientCandidate("");
            setMarketingName("");
            setAddress("");
            setDate("");
            setValidDate("");
            setPic("");
            setTelephone("");
            setService("");
            setPeriodTime("");
            setPrice("");
            setInformation("");
            console.log("Data Added:", created);
            Swal.fire({ title: "Saved!", icon: "success" });
          })
          .catch((error) => {
            toast.error("Error Adding Data!", {
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
        removeOffer(id)
          .then((response) => {
            setListOfOffer((prev) => prev.filter((offer) => offer.id !== id));
            console.log("Data Deleted:", response);
            Swal.fire({
              title: "Deleted!",
              icon: "success",
            });
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
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/offer/edit/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const searchTerm = searchFilter.toLowerCase();
  const searchDigits = sanitizeDigits(searchFilter);

  const filteredOffer = listOfOffer
    .filter((offer) => {
      const formattedDate = formatDateValue(offer.date, "d MMMM yyyy");
      const formattedValidDate = formatDateValue(
        offer.valid_date,
        "d MMMM yyyy"
      );
      const formattedPeriodTime = formatDateValue(
        offer.period_time,
        "MMMM yyyy"
      );

      return (
        offer.creator_name.toLowerCase().includes(searchTerm) ||
        offer.client_candidate.toLowerCase().includes(searchTerm) ||
        offer.marketing_name.toLowerCase().includes(searchTerm) ||
        offer.address.toLowerCase().includes(searchTerm) ||
        formattedDate.toLowerCase().includes(searchTerm) ||
        formattedValidDate.toLowerCase().includes(searchTerm) ||
        offer.pic.toLowerCase().includes(searchTerm) ||
        String(offer.telephone).toLowerCase().includes(searchTerm) ||
        offer.service.toLowerCase().includes(searchTerm) ||
        formattedPeriodTime.toLowerCase().includes(searchTerm) ||
        formatWithComma(offer.price).toLowerCase().includes(searchTerm) ||
        (searchDigits && sanitizeDigits(offer.price).includes(searchDigits)) ||
        offer.information.toLowerCase().includes(searchTerm) ||
        offer.offer_status.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const aLow =
        a.offer_status === "Rejected" || a.offer_status === "Nothing";
      const bLow =
        b.offer_status === "Rejected" || b.offer_status === "Nothing";
      if (aLow && !bLow) return 1;
      if (!aLow && bLow) return -1;
      return 0;
    });

  const paginatedOffer = filteredOffer.slice((page - 1) * limit, page * limit);

  const formatNumber = (value) => formatWithComma(value);

  const handleChange = (e) => {
    const input = sanitizeDigits(e.target.value);
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
              required>
              <option value="" hidden>
                --Please Choose Options--
              </option>
              {filteredEmployee.map((employee) => (
                <option key={employee.id}>{employee.name}</option>
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

        <div className="row mt-3">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>No</th>
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
              <tbody className="text-center align-middle">
                {paginatedOffer.map((offer, index) => {
                  return (
                    <tr key={offer.id}>
                      <td>{index + 1}</td>
                      <td>{offer.creator_name}</td>
                      <td>{offer.client_candidate}</td>
                      <td>{offer.marketing_name}</td>
                      <td>{offer.address}</td>
                      <td>{formatDateValue(offer.date, "d MMMM yyyy")}</td>
                      <td>
                        {formatDateValue(offer.valid_date, "d MMMM yyyy")}
                      </td>
                      <td>{offer.pic}</td>
                      <td>{offer.telephone}</td>
                      <td>{offer.service}</td>
                      <td>{formatDateValue(offer.period_time, "MMMM yyyy")}</td>
                      <td>{formatNumber(offer.price)}</td>
                      <td>{offer.information}</td>
                      <td>{offer.offer_status}</td>
                      <td>
                        {offer.offer_status !== "Accepted" && (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(offer.id)}>
                            Edit
                          </button>
                        )}
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(offer.id)}>
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
        {/* Pagination Offers */}
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(filteredOffer.length / limit)}
          </span>
          <button
            className="btn btn-primary"
            disabled={page >= Math.ceil(filteredOffer.length / limit)}
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Offer;
