import React from "react";
import { MONTHS } from "../../utils/constants";

export default function BonusFilters({
  employees,
  selectedEmployee,
  setSelectedEmployee,
  currentYear,
  setCurrentYear,
  selectedMonth,
  setSelectedMonth,
  onCalculate,
  onDelete,
}) {
  return (
    <form className="row g-3" onSubmit={onCalculate}>
      <div className="form-group col-md-6 mt-1">
        <label htmlFor="employee_name"> Nama Karyawan </label>
        <select
          name="employee_name"
          className="form-select"
          value={selectedEmployee}
          onChange={(event) => setSelectedEmployee(event.target.value)}
          required>
          <option value="" hidden>
            ---Please Choose Options---
          </option>
          {employees.map((employee) => (
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
      <div className="form-group col-md-6 mt-1">
        <label htmlFor="month"> Bulan </label>
        <select
          name="month"
          className="form-select"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          disabled={selectedEmployee === ""}
          required>
          <option value="" hidden>
            --Please Choose Options--
          </option>
          {MONTHS.map((month) => (
            <option key={month.key} value={month.name}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-lg-12 mt-3 d-flex justify-content-start gap-2">
        <button className="btn btn-success" type="submit">
          Calculate
        </button>
        <button
          className="btn btn-danger"
          type="button"
          onClick={onDelete}
          disabled={!selectedEmployee || !selectedMonth}>
          Delete
        </button>
      </div>
    </form>
  );
}

