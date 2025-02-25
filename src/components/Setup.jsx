import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

function Setup() {
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [listOfClient, setListOfClient] = useState([]);
  const [listOfSetup, setListOfSetup] = useState([]);
  const [addedClient, setAddedClient] = useState([]);
  const [client_candidate, setClientCandidate] = useState("");
  const [contract_value, setContractValue] = useState("");
  const [commission_price, setCommissionPrice] = useState("");
  const [software_price, setSoftwarePrice] = useState("");
  const [employee1, setEmployee1] = useState("");
  const [employee2, setEmployee2] = useState("");
  const [percent1, setPercent1] = useState("%");
  const [percent2, setPercent2] = useState("%");
  const [net_value1, setNetValue1] = useState("");
  const [net_value2, setNetValue2] = useState("");
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
        const activeEmployees = response.data.filter(
          (employee) => employee.status !== "Inactive"
        );
        setFilteredEmployee(activeEmployees);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/clients/")
      .then((response) => {
        setListOfClient(response.data);
        const activeClient = response.data.filter(
          (client) => client.client_status !== "Inactive"
        );
        setFilteredClient(activeClient);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/setups/")
      .then((response) => {
        setListOfSetup(response.data);
        setAddedClient(response.data.map((setup) => setup.client_candidate));
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

  const handleAddSetup = (e) => {
    e.preventDefault();
    const newSetup = {
      client_candidate: client_candidate,
      contract_value: contract_value,
      commission_price: commission_price,
      software_price: software_price,
      employee1: employee1,
      employee2: employee2,
      percent1: percent1,
      percent2: percent2,
      net_value1: net_value1,
      net_value2: net_value2,
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
          .post("http://localhost:3001/setups", newSetup)
          .then((response) => {
            setAddedClient([...addedClient, client_candidate]);
            console.log("Data Added:", response.data);
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

  const handleSaveToControl = (e) => {
    e.preventDefault();

    const saveToControl = filteredSetup.map((setup) => ({
      client_name: setup.client_candidate,
      employee1: setup.employee1,
      employee2: setup.employee2,
      net_value1: setup.net_value1,
      net_value2: setup.net_value2,
    }));

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
          .post("http://localhost:3001/controls/creating-data", saveToControl)
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
          .delete(`http://localhost:3001/setups/${id}`)
          .then((response) => {
            const deletedSetup = listOfSetup.filter((setup) => setup.id !== id);
            setListOfSetup(deletedSetup);
            setAddedClient(deletedSetup.map((setup) => setup.client_candidate));
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
    navigate(`/project-setup/edit/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const filteredSetup = listOfSetup
    .filter((setup) => {
      const client = filteredClient.find(
        (client) => client.client_name === setup.client_candidate
      );
      return client && client.client_status === "Active";
    })
    .filter(
      (setup) =>
        setup.client_candidate
          .toLowerCase()
          .includes(searchFilter.toLowerCase()) ||
        setup.contract_value
          .toLowerCase()
          .includes(searchFilter.toLowerCase()) ||
        setup.commission_price
          .toLowerCase()
          .includes(searchFilter.toLowerCase()) ||
        setup.software_price
          .toLowerCase()
          .includes(searchFilter.toLowerCase()) ||
        setup.employee1.toLowerCase().includes(searchFilter.toLowerCase()) ||
        setup.percent1.toLowerCase().includes(searchFilter.toLowerCase()) ||
        setup.employee2.toLowerCase().includes(searchFilter.toLowerCase()) ||
        setup.percent2.toLowerCase().includes(searchFilter.toLowerCase()) ||
        setup.net_value1.toLowerCase().includes(searchFilter.toLowerCase()) ||
        setup.net_value2.toLowerCase().includes(searchFilter.toLowerCase())
    );

  const paginatedSetup = filteredSetup.slice((page - 1) * limit, page * limit);

  const availableClient = filteredClient.filter(
    (client) => !addedClient.includes(client.client_name)
  );

  const handleEmployee1Change = (e) => {
    const selectedEmployee = e.target.value;
    setEmployee1(selectedEmployee);

    if (selectedEmployee === employee2) {
      setEmployee2("");
    }
  };

  const handleEmployee2Change = (e) => {
    const selectedEmployee = e.target.value;
    setEmployee2(selectedEmployee);

    if (selectedEmployee === employee1) {
      setEmployee1("");
    }
  };

  const filteredEmployee1 = filteredEmployee.filter(
    (employee) => employee.name !== employee2
  );

  const filteredEmployee2 = filteredEmployee.filter(
    (employee) => employee.name !== employee1
  );

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const calculateNetValue1 = (
    contractValue,
    commissionPrice,
    softwarePrice,
    percent1
  ) => {
    const parsedContractValue = parseFloat(contractValue.replace(/\./g, ""));
    const parsedCommissionPrice = parseFloat(
      commissionPrice.replace(/\./g, "")
    );
    const parsedSoftwarePrice = parseFloat(softwarePrice.replace(/\./g, ""));
    const parsedPercent1 = parseFloat(percent1) / 100;

    const result =
      (parsedContractValue - parsedCommissionPrice - parsedSoftwarePrice) *
      parsedPercent1;
    return isNaN(result) ? "" : formatNumber(Math.round(result).toString());
  };

  const calculateNetValue2 = (
    contractValue,
    commissionPrice,
    softwarePrice,
    percent2
  ) => {
    const parsedContractValue = parseFloat(contractValue.replace(/\./g, ""));
    const parsedCommissionPrice = parseFloat(
      commissionPrice.replace(/\./g, "")
    );
    const parsedSoftwarePrice = parseFloat(softwarePrice.replace(/\./g, ""));
    const parsedPercent2 = parseFloat(percent2) / 100;

    const result =
      (parsedContractValue - parsedCommissionPrice - parsedSoftwarePrice) *
      parsedPercent2;
    return isNaN(result) ? "" : formatNumber(Math.round(result).toString());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const input = value.replace(/\./g, "");
    const formattedNumber = formatNumber(input);

    switch (name) {
      case "contract_value":
        setContractValue(formattedNumber);
        setNetValue1(
          calculateNetValue1(
            formattedNumber,
            commission_price,
            software_price,
            percent1
          )
        );
        setNetValue2(
          calculateNetValue2(
            formattedNumber,
            commission_price,
            software_price,
            percent2
          )
        );
        break;
      case "commission_price":
        setCommissionPrice(formattedNumber);
        setNetValue1(
          calculateNetValue1(
            contract_value,
            formattedNumber,
            software_price,
            percent1
          )
        );
        setNetValue2(
          calculateNetValue2(
            contract_value,
            formattedNumber,
            software_price,
            percent2
          )
        );
        break;
      case "software_price":
        setSoftwarePrice(formattedNumber);
        setNetValue1(
          calculateNetValue1(
            contract_value,
            commission_price,
            formattedNumber,
            percent1
          )
        );
        setNetValue2(
          calculateNetValue2(
            contract_value,
            commission_price,
            formattedNumber,
            percent2
          )
        );
        break;
      case "percent1":
        setPercent1(formattedNumber);
        setNetValue1(
          calculateNetValue1(
            contract_value,
            commission_price,
            software_price,
            formattedNumber
          )
        );
        break;
      case "percent2":
        setPercent2(formattedNumber);
        setNetValue2(
          calculateNetValue2(
            contract_value,
            commission_price,
            software_price,
            formattedNumber
          )
        );
        break;
      default:
    }
  };

  const handleClientChange = (e) => {
    const selectedClient = e.target.value;
    setClientCandidate(selectedClient);

    const client = filteredClient.find(
      (client) => client.client_name === selectedClient
    );
    if (client) {
      setContractValue(client.contract_value);
      setNetValue1(
        calculateNetValue1(
          client.contract_value,
          commission_price,
          software_price,
          percent1
        )
      );
      setNetValue2(
        calculateNetValue2(
          client.contract_value,
          commission_price,
          software_price,
          percent2
        )
      );
    }
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Tabel Setup Project</h3>
        <form className="row g-3" onSubmit={handleAddSetup}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="client_candidate"> Nama Klien </label>
            <select
              className="form-select"
              value={client_candidate}
              onChange={handleClientChange}
              required
            >
              <option value="" hidden>
                ---Please Choose Options---
              </option>
              {availableClient.map((client) => (
                <option key={client.id} value={client.client_name}>
                  {client.client_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-6 mt-1">
            <label htmlFor="contract_value">Nilai Kontrak</label>
            <input
              type="text"
              className="form-control"
              name="contract_value"
              placeholder="Insert Contract Value"
              value={contract_value}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="commission_price"> Biaya Komisi </label>
            <input
              type="text"
              className="form-control"
              name="commission_price"
              placeholder="Insert Commission Fee"
              value={commission_price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="software_price"> Harga Software </label>
            <input
              type="text"
              className="form-control"
              name="software_price"
              placeholder="Insert Software Price"
              value={software_price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="employee1">Karyawan 1</label>
            <select
              className="form-select"
              value={employee1}
              onChange={handleEmployee1Change}
            >
              <option value="" hidden>
                ---Please Choose Option---
              </option>
              {filteredEmployee1.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="employee2">Karyawan 2</label>
            <select
              className="form-select"
              value={employee2}
              onChange={handleEmployee2Change}
            >
              <option value="" hidden>
                ---Please Choose Option---
              </option>
              {filteredEmployee2.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="percent1">Persentase 1</label>
            <input
              type="text"
              name="percent1"
              className="form-control"
              placeholder="Insert Percent 1"
              value={percent1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="percent2">Persentase 2</label>
            <input
              type="text"
              name="percent2"
              className="form-control"
              placeholder="Insert Percent 2"
              value={percent2}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="net_value1">Net Value 1</label>
            <input
              type="text"
              name="net_value1"
              className="form-control"
              placeholder="Insert Net Value 1"
              value={net_value1}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="net_value2">Net Value 2</label>
            <input
              type="text"
              name="net_value2"
              className="form-control"
              placeholder="Insert Net Value 2"
              value={net_value2}
              onChange={handleChange}
              required
              disabled
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
          <div className="col 12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>Nomor</th>
                  <th>Nama Klien</th>
                  <th>Nilai Kontrak</th>
                  <th>Biaya Komisi</th>
                  <th>Harga Software</th>
                  <th>Karyawan 1</th>
                  <th>Karyawan 2</th>
                  <th>Persentase 1</th>
                  <th>Persentase 2</th>
                  <th>Net Value 1</th>
                  <th>Net Value 2</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {paginatedSetup.map((setup, index) => {
                  return (
                    <tr key={setup.id}>
                      <td>{index + 1}</td>
                      <td>{setup.client_candidate}</td>
                      <td>{setup.contract_value}</td>
                      <td>{setup.commission_price}</td>
                      <td>{setup.software_price}</td>
                      <td>{setup.employee1}</td>
                      <td>{setup.employee2}</td>
                      <td>{setup.percent1}</td>
                      <td>{setup.percent2}</td>
                      <td>{setup.net_value1}</td>
                      <td>{setup.net_value2}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(setup.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(setup.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Setups */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(filteredSetup.length / limit)}
              </span>
              <button
                className="btn btn-primary"
                disabled={page >= Math.ceil(filteredSetup.length / limit)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <form className="row g-3" onSubmit={handleSaveToControl}>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default Setup;
