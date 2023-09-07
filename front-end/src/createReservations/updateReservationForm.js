import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { isNotTuesday, isFutureOnly } from "../utils/date-time";
import { findReservation, modifyReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./reservationForm";

export default function Edit() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState({  
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: 0,});

  useEffect(() => {
    async function loadReservation() {
      const controller = new AbortController();
      try {
        const reservation = await findReservation(reservation_id, controller.signal);
        setReservationData(reservation);
      } catch (error) {
        setError(error);
      }
      return () => controller.abort();
    }
    loadReservation();
  }, [reservation_id]);

  const findErrors = (res, errors) => {
    isNotTuesday(res.reservation_date, errors);
    isFutureOnly(res.reservation_date, errors);
    if (res.status && res.status !== "booked") {
      errors.push(
        <li key="not booked">Reservation cannot be modified.</li>
      );
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const controller = new AbortController();
    const errors = [];
    findErrors(reservationData, errors);
    if (errors.length) {
      setError({ message: errors });
      return;
    }
    try {
      reservationData.people = Number(reservationData.people);
      await modifyReservation(reservation_id, reservationData, controller.signal);
      history.push(`/dashboard?date=${reservationData.reservation_date}`);
    } catch (error) {
      setError(error);
    }
    return () => controller.abort();
  }

  const handleFormChange = (event) => {
    setReservationData({
      ...reservationData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <ErrorAlert error={error} />
      <ReservationForm
        formData={reservationData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}