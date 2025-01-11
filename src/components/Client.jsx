import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Client() {
  const [listOfClient, setListOfClient] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/clients/")
      .then((response) => {
        setListOfClient(response.data);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  const handleActiveAndInactive = (id, newStatus) => {
    axios
      .put(`http://localhost:3001/clients/${id}`, {
        client_status: newStatus,
      })
      .then(() => {
        setListOfClient((prevClients) =>
          prevClients.map((client) =>
            client.id === id ? { ...client, client_status: newStatus } : client
          )
        );
        console.log("Client Status Updated!");
      })
      .catch((err) => {
        console.error("Error Updating Client Status", err);
      });
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const filteredClient = listOfClient.filter((client) => {
    const formattedValidDate = formatDate(client.createdAt);

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
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Tabel Klien</h3>
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
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
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
              <tbody className="text-center align-middle">
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
                          className="btn btn-primary"
                          onClick={() =>
                            handleActiveAndInactive(client.id, "Active")
                          }
                        >
                          Active
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleActiveAndInactive(client.id, "Inactive")
                          }
                        >
                          Inactive
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
