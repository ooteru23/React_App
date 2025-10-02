import React from "react";
import { createBonusKey } from "../../utils/bonusKeys";
import { formatCurrency } from "../../utils/currency";

export default function BonusTable({ paginatedBonus, page, totalPages, limit, setPage }) {
  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <table className="table table-bordered border border-secondary">
            <thead className="text-center align-middle">
              <tr>
                <th>Nomor</th>
                <th>Nama Klien</th>
                <th>Bulan</th>
                <th>Status Pekerjaan</th>
                <th>Net Value</th>
                <th>Status Pencairan Bonus</th>
              </tr>
            </thead>
            <tbody className="text-center align-middle">
              {paginatedBonus.length === 0 ? (
                <tr>
                  <td colSpan={6}>Tidak ada data</td>
                </tr>
              ) : (
                paginatedBonus.map((row, index) => (
                  <tr key={createBonusKey(row.clientName, row.month, row.employee)}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{row.clientName}</td>
                    <td>{row.month}</td>
                    <td>{row.workStatus}</td>
                    <td>{formatCurrency(row.netValue)}</td>
                    <td>{row.disbursement_bonus}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          disabled={page === 1}
          onClick={() => setPage((current) => Math.max(current - 1, 1))}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={page >= totalPages}
          onClick={() => setPage((current) => Math.min(current + 1, totalPages))}>
          Next
        </button>
      </div>
    </>
  );
}

