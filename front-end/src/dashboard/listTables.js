import React from "react";




function ListTables({ tables }) {
  if (!tables) {
    return null;
  }

  const formatTable = tables.map((table) => {
    const status = table.reservation_id ? "Occupied" : "Free";
    return (
      <tr key={table.table_id}>
        <th scope="row">{table.table_id}</th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{status}</td>
      </tr>
    );
  });

  return (
    <div>
      <table className="table table-sm table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Table</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{formatTable}</tbody>
      </table>
    </div>
  );
}


export default ListTables;