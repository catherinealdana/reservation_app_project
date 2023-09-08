/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}


// adding function to create a reservation 

/**
 * Creates a new reservation.
 * @param reservationData
 *  the reservation data to be created
 * @param signal
 *  an optional AbortController.signal for cancelling the request
 * @returns {Promise}
 *  a promise that resolves to the created reservation data
 */

// export async function createReservation(reservation) {
//   const url = new URL(`${API_BASE_URL}/reservations`);
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json", 
//      },
//     body: JSON.stringify(reservation), 
//   };
//   try {
//     const response = await fetch(url, options);
//     if (!response.ok) {
//       const errorData = await response.json(); 
//       throw new Error(errorData.message || "An error occurred.");
//     }

//     return await response.json();
//   } catch (error) {
//     throw error; 
//   }
// }
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation}),
    signal,
  };
  return await fetchJson(url, options);
}


//adding function to create a new table 


export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, []);
}


//adding a function to seats a new reservation to a table 


export async function seatReservation(table_id, reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: reservation_id } }),
    signal,
  };
  return await fetchJson(url, options, []);
}

// to retrieve tables

export async function listAllTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}



//finish a reservation already seated 

export async function releaseTable(table_id, reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options, []);
}


//to find reservation 


export async function findReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}


//Updates reservation info

export async function modifyReservation(id, res, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${id}`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: res }),
    signal,
  };
  return await fetchJson(url, options, []);
}


//to cancel a reservation
export async function cancelReservation(reservation_id) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
  };
  return await fetchJson(url, options, []);
}


// export async function isAfterCloseTime(reservationTime) {
//   // Define the close time as a constant
//   const closeTime = new Date(`1970-01-01T21:30:00`); // Adjust this to your actual close time

//   // Parse the reservation time string to a Date object
//   const reservationDateTime = new Date(`1970-01-01T${reservationTime}`);

//   // Compare the reservation time with the close time
//   return reservationDateTime > closeTime;
// }




