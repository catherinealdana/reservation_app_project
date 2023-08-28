import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { isFutureOnly, isNotTuesday } from "../utils/date-time";



// FUNCTION RESERVATION FORM 


function ReservationForm() {
    const [reservationsError,setReservationsError]= useState(null);
    const history=useHistory();
    const [formData, setFormData]= useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
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

    
    const handleFormSubmit = async (event) => {
        event.preventDefault();
      
        const [hour, minute] = formData.reservation_time.split(':');
        const parsedHour = parseInt(hour, 10);
        const parsedMinute = parseInt(minute, 10);
      
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
      
        const openingHour = 10;
        const closingHour = 21;
      
        if (
          parsedHour < openingHour ||
          parsedHour > closingHour ||
          (parsedHour === closingHour && parsedMinute > 30) ||
          currentHour > parsedHour ||
          (currentHour === parsedHour && currentMinute > parsedMinute)
        ) {
          setReservationsError({ message: "Invalid reservation time. Please choose a valid time." });
          return;
        }
      
        const controller = new AbortController();
        const errors = [];
        findErrors(formData.reservation_date, errors);
      
        if (errors.length) {
          setReservationsError({ message: errors });
          return;
        }
      
        try {
          formData.people = Number(formData.people);
          await createReservation(formData, controller.signal);
          const date = formData.reservation_date;
          history.push(`/dashboard?date=${date}`);
        } catch (error) {
          setReservationsError(error);
        }
      
        return () => controller.abort();
      };
      
    
    
    return (
        <form onSubmit={handleFormSubmit} className="my-4">
        <h2 className="mb-4">New Reservation</h2>
        <div className="mb-3">
            <label className="form=label">
                First Name:
            <input
            type="text"
            className="form-control"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
            required
           />
           </label>
        </div>
        <div className="mb-3">
            <label className="form=label">
            Last Name:
            <input
            type="text"
            className="form-control"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
            required
            />
            </label>
        </div>
        <div className="mb-3">
            <label className="form=label">
            Mobile Number:
            <input
            type="tel"
            className="form-control"
            name="mobile_number"
            id="mobile_number"
            value={formData.mobile_number}
            onChange={handleFormChange}
            required
            />
            </label>
        </div>
        <div className="mb-3">
            <label className="form=label">
            Reservation Date:
            <input
            type="date"
            className="form-control"
            name="reservation_date"
            id="reservation_date"
            value={formData.reservation_date}
            onChange={handleFormChange}
            required
            />
            </label>
        </div>
        <div className="mb-3">
            <label className="form=label">
            Reservation Time:
            <input
            type="time"
            className="form-control"
            name="reservation_time"
            id="reservation_time"
            value={formData.reservation_time}
            onChange={handleFormChange}
            required
            />
            </label>
        </div>
        <div className="mb-3">
            <label className="form=label">
            Number of People:
            <input
            type="number"
            className="form-control"
            name="people"
            id="people"
            value={formData.people}
            onChange={handleFormChange}
            min="1"
            required
            />
            </label>
        </div>
        <div className="custom-button-group">
            <button type="submit" className="custom-button custom-primary">
                Submit
            </button>
            <button onClick={()=> history.goBack()} className="custom-button custom-secondary">
                Cancel
            </button>
        </div>
        <ErrorAlert error={reservationsError} />
          
        </form>
    );

}


export default ReservationForm;



