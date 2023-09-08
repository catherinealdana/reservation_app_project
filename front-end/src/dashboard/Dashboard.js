import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory} from "react-router-dom"
import { listReservations,listAllTables } from "../utils/api";
import { previous,next } from "../utils/date-time";
import ListTables from "./TablesinDashboard/listTables";
import ReservationList from "./lineReservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);



  function loadDashboard() {
    const controller = new AbortController();
    setReservationsError(null);
    listReservations({ date }, controller.signal)
      .then(setReservations)
      .then(listAllTables)
      .then(setTables)
      .catch(setReservationsError);
    return () => controller.abort();
  }

  function handleToday() {
    history.push(`/dashboard`);
  }

  function handlePreviousDay() {
    history.push(`/dashboard?date=${previous(date)}`);
  }

  function handleNextDay() {
    history.push(`/dashboard?date=${next(date)}`);
  }

  return (
    <main>
      <h1 className="d-md-flex justify-content-center">Dashboard</h1>
      <div className="d-md-flex mb-3 justify-content-center">
        <h2 className="mb-0">Reservations for {date}</h2>
      </div>
      <div className="pb-2 d-flex justify-content-center">
        <button className="btn btn-dark mr-1" onClick={handlePreviousDay}>
          previous
        </button>
        <button className="btn btn-dark mr-1" onClick={handleToday}>
          today
        </button>
        <button className="btn btn-dark" onClick={handleNextDay}>
          next
        </button>
      </div>
      <ErrorAlert error ={reservationsError} />
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