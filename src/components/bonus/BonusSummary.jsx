import React from "react";
import { formatCurrency } from "../../utils/currency";

export default function BonusSummary({
  stats,
  salaryDeductionNumber,
  onSalaryDeductionChange,
  onSave,
}) {
  return (
    <form className="row g-3" onSubmit={onSave}>
      <div className="form-group col-md-6 mt-3">
        <label htmlFor="totalValue"> Total Value : </label>
        <input
          type="text"
          className="form-control w-50"
          value={formatCurrency(stats.totalValue)}
          disabled
        />
      </div>
      <div className="form-group col-md-6 mt-3">
        <label htmlFor="salary_deduction"> Pengurang (Hitungan Gaji) : </label>
        <input
          type="text"
          className="form-control w-50"
          value={salaryDeductionNumber.toLocaleString("en-US")}
          onChange={onSalaryDeductionChange}
        />
      </div>
      <div className="form-group col-md-6 mt-3">
        <label htmlFor="Debt_Recipient"> Hutang Penerimaan : </label>
        <input type="text" className="form-control w-50" disabled />
      </div>
      <div className="form-group col-md-6 mt-3">
        <label htmlFor="component_bonus"> Bonus Komponen : </label>
        <input
          type="text"
          className="form-control w-50"
          value={formatCurrency(stats.bonusComponent)}
          disabled
        />
      </div>
      <div className="form-group col-md-6 mt-3">
        <label className="percentOnTime">Persentase Total ON TIME :</label>
        <div className="input-group w-50">
          <input
            type="text"
            className="form-control text-start"
            value={stats.percentOnTime}
            disabled
          />
          <span className="input-group-text">%</span>
        </div>
      </div>
      <div className="form-group col-md-6 mt-3">
        <label> Total ON TIME : </label>
        <input
          type="text"
          className="form-control w-50"
          value={formatCurrency(stats.totalOnTime)}
          disabled
        />
      </div>
      <div className="form-group col-md-6 mt-3">
        <label> Persentase Total LATE : </label>
        <div className="input-group w-50">
          <input
            type="text"
            className="form-control text-start"
            value={stats.percentLate}
            disabled
          />
          <span className="input-group-text">%</span>
        </div>
      </div>
      <div className="form-group col-md-6 mt-3">
        <label> Total LATE : </label>
        <input
          type="text"
          className="form-control w-50"
          value={formatCurrency(stats.totalLate)}
          disabled
        />
      </div>
      <div className="form-group col-md-6 mt-3">
        <label> Persentase Bonus ON TIME : </label>
        <div className="input-group w-50">
          <input type="text" className="form-control text-start" value={15} disabled />
          <span className="input-group-text">%</span>
        </div>
      </div>
      <div className="form-group col-md-6 mt-3">
        <label> Bonus ON TIME : </label>
        <input
          type="text"
          className="form-control w-50"
          value={formatCurrency(stats.bonusOnTime)}
          disabled
        />
      </div>
      <div className="form-group col-md-6 mt-3">
        <label> Persentase Bonus Late : </label>
        <div className="input-group w-50">
          <input type="text" className="form-control text-start" value={10} disabled />
          <span className="input-group-text">%</span>
        </div>
      </div>
      <div className="form-group col-md-6 mt-3">
        <label> Bonus Late : </label>
        <input
          type="text"
          className="form-control w-50"
          value={formatCurrency(stats.bonusLate)}
          disabled
        />
      </div>
      <div className="form-group col-md-6 mt-3" hidden>
        <label> Total : </label>
        <input
          type="text"
          className="form-control w-50"
          value={formatCurrency(stats.total)}
          disabled
        />
      </div>
      <div className="col-lg-12 mt-3">
        <button className="btn btn-success" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

