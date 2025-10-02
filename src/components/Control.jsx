import React, { useEffect, useMemo, useState } from "react";
import {
  list as listControls,
  create as createControl,
} from "../services/controlsApi";
import { list as listEmployees } from "../services/employeesApi";
import { list as listClients } from "../services/clientsApi";
import { list as listSetups } from "../services/setupsApi";
import { ToastContainer } from "react-toastify";
import Select from "react-select";
import Swal from "sweetalert2";
import { STATUS, MONTHS } from "../utils/constants";
import { notify } from "../utils/notify";

const STATUS_OPTIONS = [
  { value: STATUS.ON_TIME, label: STATUS.ON_TIME },
  { value: STATUS.LATE, label: STATUS.LATE },
];

function Control() {
  const [listOfControl, setListOfControl] = useState([]);
  const [listOfClient, setListOfClient] = useState([]);
  const [listOfSetup, setListOfSetup] = useState([]);
  const [filteredControl, setFilteredControl] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear().toString());
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [page, setPage] = useState(1);

  const currentMonth = useMemo(
    () => new Date().toLocaleString("default", { month: "long" }),
    []
  );

  const limit = 5;

  useEffect(() => {
    listEmployees()
      .then((rows) => {
        const activeEmployees = rows.filter((employee) => employee.status !== "Inactive");
        setFilteredEmployee(activeEmployees);
      })
      .catch((error) => console.error("Error getting employees:", error));
  }, []);

  useEffect(() => {
    listControls()
      .then((rows) => {
        setListOfControl(rows);
        setFilteredControl(rows);
      })
      .catch((error) => console.error("Error getting controls:", error));
  }, []);

  useEffect(() => {
    listClients()
      .then((rows) => setListOfClient(rows))
      .catch((error) => console.error("Error getting clients:", error));
  }, []);

  useEffect(() => {
    listSetups()
      .then((rows) => setListOfSetup(rows))
      .catch((error) => console.error("Error getting setups:", error));
  }, []);

  const handleSelectChange = (controlId, monthKey, selectedOption) => {
    const value = selectedOption ? selectedOption.value : "ON PROCESS";

    const applyUpdate = (controls) =>
      controls.map((control) =>
        control.id === controlId ? { ...control, [monthKey]: value } : control
      );

    setListOfControl((prev) => applyUpdate(prev));
    setFilteredControl((prev) => applyUpdate(prev));
  };

  const renderMonthDropdowns = (control) => {
    const currentMonthIndex = MONTHS.findIndex((month) => month.name === currentMonth);

    return MONTHS.slice(0, currentMonthIndex + 1).map((month) => (
      <td key={month.key} style={{ minWidth: "110px" }}>
        {isEditing && control[month.key] === "ON PROCESS" ? (
          <Select
            options={STATUS_OPTIONS}
            value={{ value: control[month.key], label: control[month.key] }}
            onChange={(option) => handleSelectChange(control.id, month.key, option)}
            placeholder="Select"
            styles={{
              control: (base) => ({
                ...base,
                minWidth: "110px",
              }),
            }}
          />
        ) : (
          <span>{control[month.key]}</span>
        )}
      </td>
    ));
  };

  const saveControls = async (controlsToSave) => {
    const responses = await Promise.all(
      controlsToSave.map((control) =>
        createControl({
          client_name: control.client_name,
          month_jan: control.month_jan ?? "ON PROCESS",
          month_feb: control.month_feb ?? "ON PROCESS",
          month_mar: control.month_mar ?? "ON PROCESS",
          month_apr: control.month_apr ?? "ON PROCESS",
          month_may: control.month_may ?? "ON PROCESS",
          month_jun: control.month_jun ?? "ON PROCESS",
          month_jul: control.month_jul ?? "ON PROCESS",
          month_aug: control.month_aug ?? "ON PROCESS",
          month_sep: control.month_sep ?? "ON PROCESS",
          month_oct: control.month_oct ?? "ON PROCESS",
          month_nov: control.month_nov ?? "ON PROCESS",
          month_dec: control.month_dec ?? "ON PROCESS",
        })
      )
    );

    return Array.isArray(responses[0]) ? responses.flat() : responses;
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (filteredControl.length === 0) {
      toast.info("Tidak ada data kontrol yang dipilih.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      const savedControls = await saveControls(filteredControl);

      setListOfControl((prev) => {
        const merged = new Map(prev.map((control) => [control.client_name, control]));
        savedControls.forEach((control) => merged.set(control.client_name, control));
        return Array.from(merged.values());
      });

      const lookup = new Map(savedControls.map((control) => [control.client_name, control]));
      setFilteredControl((prev) =>
        prev.map((control) => lookup.get(control.client_name) ?? control)
      );

      Swal.fire({ title: "Saved!", icon: "success" });
    } catch (error) {
      toast.error("Failed to save data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error saving data:", error);
    }
  };

  const deriveSetupYear = (setup) => {
    if (setup.setup_year) {
      const year = parseInt(setup.setup_year, 10);
      if (!Number.isNaN(year)) {
        return year;
      }
    }

    if (setup.period_time) {
      const year = parseInt(String(setup.period_time).slice(0, 4), 10);
      if (!Number.isNaN(year)) {
        return year;
      }
    }

    if (setup.createdAt) {
      return new Date(setup.createdAt).getFullYear();
    }

    if (setup.updatedAt) {
      return new Date(setup.updatedAt).getFullYear();
    }

    return null;
  };

  const handleCheckData = (event) => {
    event.preventDefault();

    if (!selectedEmployee) {
      notify.warning("Silakan pilih karyawan terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (listOfSetup.length === 0) {
      notify.info("Data setup belum tersedia.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const parsedYear = parseInt(currentYear, 10);
    const targetYear = Number.isNaN(parsedYear)
      ? new Date().getFullYear()
      : parsedYear;

    const activeClients = new Set(
      listOfClient
        .filter((client) => client.client_status !== "Inactive")
        .map((client) => client.client_name)
    );

    const matchingSetups = listOfSetup.filter((setup) => {
      const setupYear = deriveSetupYear(setup);
      if (setupYear !== targetYear) {
        return false;
      }

      const employeeOne = (setup.employee1 || "").toLowerCase();
      const employeeTwo = (setup.employee2 || "").toLowerCase();
      const normalizedEmployee = selectedEmployee.toLowerCase();

      return (
        employeeOne === normalizedEmployee || employeeTwo === normalizedEmployee
      );
    });

    const activeMatchingSetups = matchingSetups.filter((setup) =>
      activeClients.has(setup.client_candidate)
    );

    if (activeMatchingSetups.length === 0) {
      setFilteredControl([]);
      setPage(1);
      notify.info("Data setup tidak ditemukan untuk kriteria tersebut.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const controlByClient = new Map(
      listOfControl.map((control) => [control.client_name, control])
    );

    const createDraftControl = (setup) => {
      const draft = {
        id: `draft-${setup.id}`,
        client_name: setup.client_candidate,
      };

      MONTHS.forEach(({ key }) => {
        draft[key] = "ON PROCESS";
      });

      return draft;
    };

    const missingControls = [];
    const nextControls = activeMatchingSetups.map((setup) => {
      const existing = controlByClient.get(setup.client_candidate);
      if (existing) {
        return existing;
      }

      const draft = createDraftControl(setup);
      missingControls.push(draft);
      return draft;
    });

    if (missingControls.length > 0) {
      setListOfControl((prev) => {
        const existingNames = new Set(prev.map((control) => control.client_name));
        const merged = [...prev];

        missingControls.forEach((draft) => {
          if (!existingNames.has(draft.client_name)) {
            merged.push(draft);
            existingNames.add(draft.client_name);
          }
        });

        return merged;
      });
    }

    setFilteredControl(nextControls);
    setPage(1);
  };

  const paginatedControl = filteredControl.slice(
    (page - 1) * limit,
    page * limit
  );

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  return (
    <>
      <div className="container">
        <h3 className="text-center mt-3 mb-5">Tabel Kontrol Project</h3>
        <form className="row g-3" onSubmit={handleCheckData}>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="employee_name"> Nama Karyawan </label>
            <select
              name="employee_name"
              className="form-select"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              required>
              <option value="" hidden>
                ---Please Choose Options---
              </option>
              {filteredEmployee.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 mt-1">
            <label htmlFor="year"> Tahun </label>
            <input
              type="text"
              className="form-control"
              value={currentYear}
              onChange={(event) => setCurrentYear(event.target.value)}
            />
          </div>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Check Data
            </button>
            <ToastContainer />
          </div>
        </form>
        <br />
        <div className="row mt-3 table-responsive">
          <div className="col-12">
            <table className="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>Nomor</th>
                  <th>Nama Klien</th>
                  {MONTHS.map((month) => (
                    <th key={month.key}>{month.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {paginatedControl.map((control, index) => (
                  <tr key={control.id}>
                    <td>{index + 1}</td>
                    <td>{control.client_name}</td>
                    {renderMonthDropdowns(control)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <form className="row g-3" onSubmit={handleSave}>
          <div className="col-lg-12 mt-3">
            <button className="btn btn-success" type="submit">
              Save
            </button>
          </div>
        </form>
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(filteredControl.length / limit)}
          </span>
          <button
            className="btn btn-primary"
            disabled={page >= Math.ceil(filteredControl.length / limit)}
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Control;



