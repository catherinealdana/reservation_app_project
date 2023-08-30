import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { previous, next } from "../utils/date-time";
import ListTables from "./listTables"
import { listAllReservations,listAllTables } from "../utils/api";
import ReservationList from "./listReservation"


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history= useHistory();
  const [tables, setTables]= useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listAllReservations({ date }, abortController.signal)
        .then(setReservations)
        .then(listAllTables)
        .then(setTables)
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
      <h1 className="d-md-flex justify-content-center">Dashboard</h1>
      <div className="d-md-flex mb-3 justify-content-center">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="pb-2 d-flex justify-content-center">
        <button className="btn btn-primary mr-1" onClick={handlePreviousDay}>
          previous
        </button>
        <button className="btn btn-primary mr-1" onClick={handleToday}>
          today
        </button>
        <button className="btn btn-primary" onClick={handleNextDay}>
          next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList
        reservations={reservations}
        setReservations={setReservations}
        setError={setReservationsError}
      />
      <div>
        <ListTables tables={tables} loadDashboard={loadDashboard} />
      </div>
    </main>
  );
}

export default Dashboard;