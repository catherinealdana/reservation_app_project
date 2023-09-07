import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import { createReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { isFutureOnly, isNotTuesday } from "../utils/date-time";
import ReservationForm from "./reservationForm";


// FUNCTION RESERVATION FORM 


function CreateReservationForm() {
    const [reservationsError,setReservationsError]= useState(null);
    const history=useHistory();
    const [formData, setFormData]= useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    });

    
    
    const handleFormChange= (event) => {
        setFormData ({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const findErrors = (date, errors) => {
        isNotTuesday(date, errors);
        isFutureOnly(date, errors);
      };


      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        console.log("handleSubmit call")
        const controller = new AbortController();
        const errors = [];

        findErrors(formData.reservation_date, errors);
        if (errors.length) {

          setReservationsError({ message: errors });
          console.log("reservation error", reservationsError)
          return;
        }
        try {
          formData.people = Number(formData.people);
          console.log("creating reservation")
          await createReservation(formData, controller.signal);
          const date = formData.reservation_date;
          history.push(`/dashboard?date=${date}`);
        } catch (error) {
          setReservationsError(error);
         // setReservationsError(new Error('Reservation time must be before 9:30 PM.'));
          console.error( error);
        }
        return () => controller.abort();
      };

      
    
    return (
        <>
          
          <ReservationForm
            formData={formData}
            handleFormChange={handleFormChange}
            handleSubmit={handleSubmit}
          />
          <ErrorAlert error={reservationsError} />
        </>
      );

}


export default CreateReservationForm;

