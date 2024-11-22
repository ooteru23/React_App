import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

function Client() {
  const [listOfClient, setListOfClient] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

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

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/clients/${id}`)
      .then((response) => {
        toast.success("Data Deleted Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setListOfClient(listOfClient.filter((client) => client.id !== id));
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
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM DD, YYYY");
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const filteredClient = listOfClient.filter((client) => {
    const formattedValidDate = moment(client.valid_date).format(
      "MMMM DD, YYYY"
    );

    return (
      client.client_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      client.address.toLowerCase().includes(searchFilter.toLowerCase()) ||
      client.pic.toLowerCase().includes(searchFilter.toLowerCase()) ||
      client.telephone.toLowerCase().includes(searchFilter.toLowerCase()) ||
      client.service.toLowerCase().includes(searchFilter.toLowerCase()) ||
      client.contract_value
        .toLowerCase()
        .includes(searchFilter.toLowerCase()) ||
      formattedValidDate.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return (
    <>
      <div class="container">
        <h3 class="text-center mt-3 mb-5">Tabel Klien</h3>
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
              <thead>
                <tr>
                  <th>Nomor</th>
                  <th>Nama Klien</th>
                  <th>Alamat</th>
                  <th>PIC</th>
                  <th>Nomor Telepon</th>
                  <th>Jasa</th>
                  <th>Harga Kontrak</th>
                  <th>Tanggal Mulai</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClient.map((client, index) => {
                  return (
                    <tr key={client.id}>
                      <td>{index + 1}</td>
                      <td>{client.client_name}</td>
                      <td>{client.address}</td>
                      <td>{client.pic}</td>
                      <td>{client.telephone}</td>
                      <td>{client.service}</td>
                      <td>{client.contract_value}</td>
                      <td>{formatDate(client.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(client.id)}
                        >
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
      </div>
      <ToastContainer />
    </>
  );
}
export default Client;
