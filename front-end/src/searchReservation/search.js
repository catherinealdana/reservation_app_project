import React, { useState } from "react";
import ReservationList from "../dashboard/lineReservation";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

export default function Search() {
  const [reservations, setReservations] = useState([]);
  const [display, setDisplay] = useState(false);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);

  function changeHandler(event) {
    setMobile(event.target.value);
  }

  async function searchHandler(event) {
    event.preventDefault();
    const controller = new AbortController();
    try {
      const reservations = await listReservations(
        { mobile_number: mobile },
        controller.signal
      );
      setReservations(reservations);
      setDisplay(true);
    } catch (error) {
      setError(error);
    }
    return () => controller.abort();
  }

  return (
    <>
      <div className="d-flex justify-content-center pt-3">
        <h3>Search</h3>
      </div>
      <ErrorAlert error={error} />
      <div className="pt-3 pb-3">
        <form className="form-group" onSubmit={searchHandler}>
          <input
            name="mobile_number"
            id="mobile_number"
            onChange={changeHandler}
            placeholder="Enter a customer's phone number"
            value={mobile}
            className="form-control"
            required
          />
          <div className="pt-2">
            <button type="submit" className="btn btn-primary">
              Find
            </button>
          </div>
        </form>
      </div>
      {display && (
        <div>
          {reservations.length ? (
            <ReservationList
              reservations={reservations}
              setReservations={setReservations}
              setError={setError}
            />
          ) : (
            <h3>No reservations found</h3>
          )}
        </div>
      )}
    </>
  );
}