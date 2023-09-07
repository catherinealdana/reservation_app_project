import React from "react";
import { useHistory } from "react-router";
import { releaseTable } from "../../utils/api";

export default function TableWithFinishButton({ table, loadDashboard }) {
  const status = table.reservation_id ? "Occupied" : "Free";
  const history = useHistory();

  async function handleClick() {
    return window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    )
      ? await handleFinish(table.table_id, table.reservation_id)
      : null;
  }

  async function handleFinish(table_id, reservation_id) {
    await releaseTable(table_id, reservation_id);
    await loadDashboard();
    history.push("/dashboard");
  }

  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>{status}</td>
      {status === "Occupied" && (
        <td>
          <button
            data-table-id-finish={table.table_id}
            type="button"
            onClick={handleClick}
            className="btn btn-sm btn-primary"
          >
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}
