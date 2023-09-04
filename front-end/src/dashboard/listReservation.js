import React from "react";


function ReservationList({ reservations, setReservations, setError }) {
  if (!reservations) {
    return null;
  }

const formatted = reservations.map((res) => {
    return (
      <tr key={res.reservation_id}>
        <th scope="row">{res.reservation_id}</th>
        <td>{res.first_name}</td>
        <td>{res.last_name}</td>
        <td>{res.mobile_number}</td>
        <td>{res.people}</td>
        <td>{res.reservation_time}</td>
        <td data-reservation-id-status={res.reservation_id}>
          {res.status}
        </td>
        <td>
          {res.status === "booked" ? (
            <a
              className="btn btn-secondary"
              role="button"
              href={`/reservations/${res.reservation_id}/seat`}
            >
              Seat
            </a>
          ) : null}
        </td>
        <td>
          <a
            className="btn btn-secondary"
            role="button"
            href={`/reservations/${res.reservation_id}/edit`}
          >
            Edit
          </a>
        </td>
      </tr>
    );
  });

  return (
    <>
      <table className="table table-sm table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Number</th>
            <th scope="col">Guests</th>
            <th scope="col">Time</th>
            <th scope="col">Status</th>
            <th scope="col">Seat</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
          </tr>
        </thead>
        <tbody>{formatted}</tbody>
      </table>
    </>
  );
}

export default ReservationList;

