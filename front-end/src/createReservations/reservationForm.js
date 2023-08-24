import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";



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

    

    
    const handleChange= (event) => {
        setFormData ({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit= async (event) => {
        event.preventDefault();
        const controller= new AbortController();
        
        
        try{
            formData.people= Number(formData.people);
            await createReservation(formData, controller.signal);
            const date= formData.reservation_date;
            history.push(`/dashboard?date=${date}`);

        } catch(error){
            setReservationsError(error);

        }
        return()=> controller.abort();
    }


    
    return (
        <form onSubmit={handleSubmit} className="my-4">
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            name="mobile_name"
            id="mobile_name"
            value={formData.mobile_number}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
