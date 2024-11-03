import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Bonus() {
  return (
    <>
      <div class="container">
        <h3 class="text-center mt-3 mb-5">Kalkulasi Bonus</h3>
        <div class="form-group col-md-6 mt-1">
          <label for="employee_name"> Nama Karyawan </label>
          <select class="form-select" required>
            <option>--Please Choose Options--</option>
            <option></option>
          </select>
        </div>
        <div class="form-group col-md-6 mt-1">
          <label for="year"> Tahun </label>
          <input type="text" class="form-control" disabled />
        </div>
        <div class="form-group col-md-6 mt-1">
          <label for="month"> Bulan </label>
          <select class="form-select" required>
            <option hidden>--Please Choose Options--</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>
        <div class="col-lg-12 mt-3">
          <button class="btn btn-success" type="submit">
            Calculate
          </button>
        </div>
        <br />
        <div class="row mt-3">
          <div class="col-12">
            <table class="table table-bordered border border-secondary">
              <thead className="text-center align-middle">
                <tr>
                  <th>Nama Klien</th>
                  <th>Bulan</th>
                  <th>Status</th>
                  <th>Net Value</th>
                  <th>Status Pencairan Bonus</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <form className="row g-3">
          <div class="form-group col-md-6 mt-1">
            <label for="ontime"> Bulan On Time : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label for="late"> Bulan Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label for="total_value"> Total Net Value : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label for="salary_deduction"> Pengurang (Hitungan Gaji) : </label>
            <input type="text" className="form-control w-50" />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label for="Debt_Recipient"> Hutang Penerimaan : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label for="component_bonus"> Bonus Komponen : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label>Total OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label>Persentase Total OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label> Total Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label> Persentase Total Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label> Bonus OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label> Persentase Bonus OnTime : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label> Bonus Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="form-group col-md-6 mt-3">
            <label> Persentase Bonus Late : </label>
            <input type="text" className="form-control w-50" readonly />
          </div>
          <div class="col-lg-12 mt-3">
            <button class="btn btn-success" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Bonus;
