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






// import React from "react";
// import {useHistory} from "react-router-dom";




// // FUNCTION RESERVATION FORM 


// function ReservationForm({handleFormChange,handleFormSubmit}) {
//     const history=useHistory();
//     const formData={
//             first_name: "",
//             last_name: "",
//             mobile_number: "",
//             reservation_date: "",
//             reservation_time: "",
//             people: 1,
//           };
        
//     return (
//         <form onSubmit={handleFormSubmit} className="my-4">
//         <h2 className="mb-4">New Reservation</h2>
//         <div className="mb-3">
//             <label className="form=label">
//                 First Name:
//             <input
//             type="text"
//             className="form-control"
//             name="first_name"
//             id="first_name"
//             value={formData.first_name}
//             onChange={handleFormChange}
//             required
//            />
//            </label>
//         </div>
//         <div className="mb-3">
//             <label className="form=label">
//             Last Name:
//             <input
//             type="text"
//             className="form-control"
//             name="last_name"
//             id="last_name"
//             value={formData.last_name}
//             onChange={handleFormChange}
//             required
//             />
//             </label>
//         </div>
//         <div className="mb-3">
//         <label className="form=label">
//           Mobile Number:
//           <input
//             type="tel"
//             className="form-control"
//             name="mobile_number" 
//             id="mobile_number"
//             value={formData.mobile_number}
//             onChange={handleFormChange}
//             required
//           />
//         </label>
//       </div>
//         <div className="mb-3">
//             <label className="form=label">
//             Reservation Date:
//             <input
//             type="date"
//             className="form-control"
//             name="reservation_date"
//             id="reservation_date"
//             value={formData.reservation_date}
//             onChange={handleFormChange}
//             required
//             />
//             </label>
//         </div>
//         <div className="mb-3">
//             <label className="form=label">
//             Reservation Time:
//             <input
//             type="time"
//             className="form-control"
//             name="reservation_time"
//             id="reservation_time"
//             value={formData.reservation_time}
//             onChange={handleFormChange}
//             required
//             />
//             </label>
//         </div>
//         <div className="mb-3">
//             <label className="form=label">
//             Number of People:
//             <input
//             type="number"
//             className="form-control"
//             name="people"
//             id="people"
//             value={formData.people}
//             onChange={handleFormChange}
//             min="1"
//             required
//             />
//             </label>
//         </div>
//         <div className="custom-button-group">
//             <button type="submit" className="custom-button custom-primary">
//                 Submit
//             </button>
//             <button onClick={()=> history.goBack()} className="custom-button custom-secondary">
//                 Cancel
//             </button>
//         </div>
          
//         </form>
//     );

// }


// export default ReservationForm;


// import React from "react";
// import { useHistory } from "react-router";

// export default function Form({
//   initialformData,
//   handleFormChange,
//   handleSubmit,
// }) {
//   const history = useHistory();

//   const handleCancel = () => {
//     history.goBack();
//   };

//   return (
//     initialformData && (
//       <form onSubmit={handleSubmit} className="form-group">
//         <fieldset>
//           <legend className="d-flex justify-content-center">
//             Guest Information
//           </legend>
//           <div className="pb-1">
//             <input
//               type="text"
//               name="first_name"
//               className="form-control"
//               id="first_name"
//               placeholder={initialformData?.first_name || "First Name"}
//               value={initialformData?.first_name}
//               onChange={handleFormChange}
//               required
//             />
//           </div>
//           <div className="pb-1">
//             <input
//               type="text"
//               name="last_name"
//               className="form-control"
//               id="last_name"
//               placeholder={initialformData?.last_name || "Last Name"}
//               value={initialformData?.last_name}
//               onChange={handleFormChange}
//               required
//             />
//           </div>
//           <div className="pb-1">
//             <input
//               type="tel"
//               name="mobile_number"
//               className="form-control"
//               id="mobile_number"
//               placeholder={initialformData?.mobile_number || "Mobile Number"}
//               value={initialformData?.mobile_number}
//               onChange={handleFormChange}
//               required
//             />
//           </div>
//           <div className="pb-1">
//             <input
//               type="number"
//               name="people"
//               className="form-control"
//               id="people"
//               placeholder={initialformData?.people || "Number of guests"}
//               value={initialformData?.people}
//               onChange={handleFormChange}
//               required
//               min="1"
//             />
//           </div>

//           <input
//             type="date"
//             name="reservation_date"
//             className="form-control mb-1"
//             id="reservation_date"
//             placeholder={initialformData?.reservation_date || "YYY-MM-DD"}
//             value={initialformData?.reservation_date}
//             onChange={handleFormChange}
//             required
//           />
//           <input
//             type="time"
//             name="reservation_time"
//             className="form-control"
//             id="reservation_time"
//             placeholder={initialformData?.reservation_time || "HH:MM"}
//             value={initialformData?.reservation_time}
//             onChange={handleFormChange}
//             required
//           />
//         </fieldset>
//         <div className="d-flex justify-content-center pt-2">
//           <button type="submit" className="btn btn-primary mr-1">
//             Submit
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     )
//   );
// }

