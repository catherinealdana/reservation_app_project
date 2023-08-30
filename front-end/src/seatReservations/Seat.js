import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { listAllTables, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";



function Seat() {

    const { reservation_id } = useParams();
    const history = useHistory();
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
     const [seatTable, setSeatTable] = useState(null);

     useEffect(() => {
        async function loadTables() {
        const controller = new AbortController();
        setError(null);
        try {
            const response = await listAllTables(controller.signal);
            setTables((previous) => response);
        } catch (error) {
            setError(error);
        }
        return () => controller.abort();
        }
        loadTables();
    }, [reservation_id]);

    async function handleSubmit(event) {
        event.preventDefault();
        const controller = new AbortController();
        try {
        const response = await seatReservation(
            seatTable,
            reservation_id,
            controller.signal
        );
        if (response) {
            history.push(`/dashboard`);
        }
        } catch (error) {
            setError(error);
        }
        return () => controller.abort();
    }

    function handleCancel() {
        history.goBack();
    }

    function handleSelectTable(event) {
        setSeatTable(event.target.value);
    }

    //formatted  tables 

    const options = tables.map((table) => (
        <option
            key={table.table_id}
            value={table.table_id}
        >{`${table.table_name} - ${table.capacity}`}</option>
    ));

    return (
        <>
        <div className="d-flex justify-content-center pt-3">
            <h3>Select Table for Reservation</h3>
        </div>
        <ErrorAlert error={error} />
        <form onSubmit={handleSubmit} className="d-flex justify-content-center">
            <label htmlFor="seat_reservation">
             Seat at:
            <select
                id="table_id"
                name="table_id"
                onChange={handleSelectTable}
                className="mr-1"
                required
             >
                <option defaultValue>Select a table</option>
                {options}
            </select>
            </label>
            <button className="btn btn-primary mr-1" type="submit">
            Submit
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
            </button>
        </form>
        </>
    );
}

export default Seat;