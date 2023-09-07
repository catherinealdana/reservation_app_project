
import React from "react";
import { useHistory } from "react-router-dom";





// FUNCTION RESERVATION FORM 


function ReservationForm({formData, handleFormChange,handleSubmit }) {
    const history = useHistory();
  
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
            placeholder={formData?.first_name || "First Name"}
            value={formData?.first_name}
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
            placeholder={formData?.last_name || "Last Name"}
            value={formData?.last_name}
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
            placeholder={formData?.mobile_number || "Mobile Number"}
            value={formData?.mobile_number}
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
            placeholder={formData?.reservation_date || "YYY-MM-DD"}
            value={formData?.reservation_date}
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
            value={formData?.reservation_time}
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
            placeholder={formData?.people || "Number of guests"}
            value={formData?.people}
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
        </form>
    );

}


export default ReservationForm;