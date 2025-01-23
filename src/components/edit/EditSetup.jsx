import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function EditSetup() {
  const { id } = useParams();
  const [listOfEmployee, setListOfEmployee] = useState([]);
  const [listOfClient, setListOfClient] = useState([]);
  const [client_candidate, setClientCandidate] = useState("");
  const [contract_value, setContractValue] = useState("");
  const [commission_price, setCommissionPrice] = useState("");
  const [software_price, setSoftwarePrice] = useState("");
  const [employee1, setEmployee1] = useState("");
  const [employee2, setEmployee2] = useState("");
  const [percent1, setPercent1] = useState("");
  const [percent2, setPercent2] = useState("");
  const [net_value1, setNetValue1] = useState("");
  const [net_value2, setNetValue2] = useState("");
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
    axios
      .get("http://localhost:3001/clients")
      .then((response) => {
        setListOfClient(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/setups/${id}`)
      .then((response) => {
        setClientCandidate(response.data.client_candidate);
        setContractValue(response.data.contract_value);
        setCommissionPrice(response.data.commission_price);
        setSoftwarePrice(response.data.software_price);
        setEmployee1(response.data.employee1);
        setEmployee2(response.data.employee2);
        setPercent1(response.data.percent1);
        setPercent2(response.data.percent2);
        setNetValue1(response.data.net_value1);
        setNetValue2(response.data.net_value2);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, [id]);

  const handleUpdateSetup = (e) => {
    e.preventDefault();
    const updatedSetup = {
      client_candidate,
      contract_value,
      commission_price,
      software_price,
      employee1,
      employee2,
      percent1,
      percent2,
      net_value1,
      net_value2,
    };
    axios
      .put(`http://localhost:3001/setups/${id}`, updatedSetup)
      .then((response) => {
        navigate("/project-setup", {
          state: { message: "Data Updated Successfully!" },
        });
        console.log("Data Updated:", response.data);
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
        console.log("Error Updating Data:", error);
      });
  };

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

  const filteredEmployee1 = listOfEmployee.filter(
    (employee) => employee.name !== employee2
  );

  const filteredEmployee2 = listOfEmployee.filter(
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

    const client = listOfClient.find(
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
        <h3 className="text-center mt-3 mb-5">Edit Setup Project </h3>
        <form className="row g-3" onSubmit={handleUpdateSetup}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="client_candidate"> Nama Klien </label>
            <select
              className="form-select"
              value={client_candidate}
              onChange={handleClientChange}
              required
            >
              {listOfClient.map((client) => (
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
              name="contract_value"
              className="form-control"
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
              name="commission_price"
              className="form-control"
              placeholder="Insert Commission Price"
              value={commission_price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="software_price"> Harga Software </label>
            <input
              type="text"
              name="software_price"
              className="form-control"
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
              required
              value={employee1}
              onChange={handleEmployee1Change}
            >
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
              required
            >
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
              Edit Data
            </button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </>
  );
}

export default EditSetup;
