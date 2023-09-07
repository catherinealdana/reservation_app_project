
import React from "react";
import { cancelReservation } from "../utils/api";
import { useHistory } from "react-router-dom";

export default function ReservationList({
  reservations,
  setReservations,
  setError,
}) {
  const history = useHistory();
  
  async function cancelRes(reservation) {
    try {
      const { status } = await cancelReservation(reservation.reservation_id);
      const updated = reservations.map((res) => {
        if (res.reservation_id === reservation.reservation_id) {
          res.status = status;
        }
        return res;
      });
      setReservations(updated);
      history.go(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setError(error);
    }
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
        <td>
          <button
            className="btn btn-danger"
            data-reservation-id-cancel={res.reservation_id}
            onClick={() => handleCancel(res)}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  });

  function handleCancel(reservation) {
    return window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    )
      ? cancelRes(reservation)
      : null;
  }

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
