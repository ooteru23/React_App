import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Employee from "./components/Employee";
import EditEmployee from "./components/edit/EditEmployee";
import Offer from "./components/Offer";
import EditOffer from "./components/edit/EditOffer";
import Client from "./components/Client";
import Setup from "./components/Setup";
import EditSetup from "./components/edit/EditSetup";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/home"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/employee"
                  >
                    Halaman Karyawan
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/offer">
                    Halaman Penawaran
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/client">
                    Halaman Klien
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/project-setup">
                    Halaman Setup Project
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/project-control">
                    Halaman Kontrol Project
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/bonus-calculation">
                    Halaman Kalkulasi Bonus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/bonus-report">
                    Halaman Laporan Bonus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/commission-report">
                    Halaman Komisi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee/edit/:id" element={<EditEmployee />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/offer/edit/:id" element={<EditOffer />} />
          <Route path="/client" element={<Client />} />
          <Route path="/project-setup" element={<Setup />} />
          <Route path="/project-setup/edit/:id" element={<EditSetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
