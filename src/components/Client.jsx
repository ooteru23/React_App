import React, { useState, useEffect } from "react";
import {
  list as listClients,
  remove as removeClient,
  update as updateClient,
} from "../services/clientsApi";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

function Client() {
  const [listOfClient, setListOfClient] = useState([]);
  const [buttonStates, setButtonStates] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [selectedIds, setSelectedIds] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    listClients()
      .then((rows) => {
        const clients = Array.isArray(rows) ? rows : (rows && rows.data ? rows.data : []);
        setListOfClient(clients);

        const initialStates = {};
        clients.forEach((client) => {
          initialStates[client.id] = client.client_status;
        });
        setButtonStates(initialStates);
      })
      .catch((error) => {
        console.error("Error Getting Data:", error);
      });
  }, []);

  const handleActiveAndInactive = (id, newStatus) => {
    updateClient(id, { client_status: newStatus })
      .then(() => {
        setListOfClient((prevClients) =>
          prevClients.map((client) =>
            client.id === id ? { ...client, client_status: newStatus } : client
          )
        );
        setButtonStates((prevStates) => ({
          ...prevStates,
          [id]: newStatus,
        }));
        console.log("Client Status Updated!");
      })
      .catch((err) => {
        console.error("Error Updating Client Status", err);
      });
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const searchTerm = searchFilter.toLowerCase();

  const filteredClient = listOfClient.filter((client) => {
    const formattedValidDate = formatDate(client.createdAt);

    return (
      client.client_name?.toLowerCase().includes(searchTerm) ||
      client.address?.toLowerCase().includes(searchTerm) ||
      client.pic?.toLowerCase().includes(searchTerm) ||
      String(client.telephone ?? "")
        .toLowerCase()
        .includes(searchTerm) ||
      client.service?.toLowerCase().includes(searchTerm) ||
      String(client.contract_value ?? "")
        .toLowerCase()
        .includes(searchTerm) ||
      formattedValidDate.toLowerCase().includes(searchTerm)
    );
  });

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
        removeClient(id)
          .then((response) => {
            setListOfClient(listOfClient.filter((client) => client.id !== id));
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

  const paginatedClient = filteredClient.slice(
    (page - 1) * limit,
    page * limit
  );

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        // If already selected, remove it
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        // Otherwise, add it
        return [...prevSelected, id];
      }
    });
  };

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      // Select all currently visible (paginated) clients
      const allVisibleIds = paginatedClient.map((client) => client.id);
      setSelectedIds(allVisibleIds);
    } else {
      // Uncheck all
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    Swal.fire({
      title: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // Make DELETE requests in parallel for each selected ID
        const deleteRequests = selectedIds.map((id) => removeClient(id));

        Promise.all(deleteRequests)
          .then(() => {
            setListOfClient((prevClients) =>
              prevClients.filter((client) => !selectedIds.includes(client.id))
            );
            setSelectedIds([]);
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
        <div className="mt-3 d-flex align-items-center">
          <input
            type="checkbox"
            checked={
              paginatedClient.length > 0 &&
              selectedIds.length === paginatedClient.length
            }
            onChange={handleCheckAll}
          />
          <label className="ms-2">Check all</label>
          <div className="ms-2">
            <button onClick={handleDeleteSelected}>Delete</button>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th></th>
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
                {paginatedClient.map((client, index) => {
                  const isActive = buttonStates[client.id] === "Active";
                  return (
                    <tr key={client.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(client.id)}
                          onChange={() => handleCheckboxChange(client.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{client.client_name}</td>
                      <td>{client.address}</td>
                      <td>{client.pic}</td>
                      <td>{client.telephone}</td>
                      <td>{client.service}</td>
                      <td>{client.contract_value}</td>
                      <td>{formatDate(client.createdAt)}</td>
                      <td>
                        <input
                          type="radio"
                          className="btn-check"
                          id={`btn-check-active-${client.id}`}
                          checked={isActive}
                          readOnly
                        />
                        <button
                          className="btn btn-primary custom"
                          htmlFor={`btn-check-active-${client.id}`}
                          onClick={() =>
                            handleActiveAndInactive(client.id, "Active")
                          }>
                          Active
                        </button>
                        <input
                          type="radio"
                          className="btn-check"
                          id={`btn-check-inactive-${client.id}`}
                          checked={!isActive}
                          readOnly
                        />
                        <button
                          className="btn btn-danger custom"
                          htmlFor={`btn-check-inactive-${client.id}`}
                          onClick={() =>
                            handleActiveAndInactive(client.id, "Inactive")
                          }>
                          Inactive
                        </button>
                        <button
                          className="btn btn-danger custom"
                          onClick={() => handleDelete(client.id)}>
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
        {/* Pagination Clients */}
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(filteredClient.length / limit)}
          </span>
          <button
            className="btn btn-primary"
            disabled={page >= Math.ceil(filteredClient.length / limit)}
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default Client;




