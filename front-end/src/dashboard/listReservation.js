import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listAllReservations } from "../utils/api";

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReservations = async () => {
            try {
                const response = await listAllReservations({});
                setReservations(response);
            } catch (error) {
                setError(error);
            }
        };
        loadReservations();
    }, []);

    return (
        <div>
            <h2>All Reservations</h2>
            {error ? (
                <p>Error loading reservations: {error.message}</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.reservation_id}>
                            <strong>Reservation ID:</strong> {reservation.reservation_id}<br />
                            <strong>Name:</strong> {reservation.first_name} {reservation.last_name}<br />
                            <strong>Date:</strong> {reservation.reservation_date}<br />
                            <strong>Time:</strong> {reservation.reservation_time}<br />
                            <strong>Party Size:</strong> {reservation.people}<br />
                            <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                                <button>Seat</button>
                            </Link>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReservationList;
