import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  //const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history= useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
       // .then(setReservations)
        .catch(setReservationsError);
    return () => abortController.abort();
  }

  //handler functions by day 

  function handlePreviousDay(){
    const newDate= previous(date);
    history.push(`/dashboard?date=${newDate}`);
  }

  function handleToday(){
    history.push(`/dashboard`);
  }

  function handleNextDay(){
    history.push(`/dashboard?date=${next(date)}`);
  }



  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="pb-2 d-flex justify-content-center">
        <button className="btn btn-primary mr-1" onClick={handlePreviousDay}>
          Previous
        </button>
        <button className="btn btn-primary mr-1" onClick={handleToday}>
          Today
        </button>
        <button className="btn btn-primary mr-1" onClick={handleNextDay}>
          Next 
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;