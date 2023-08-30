import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert" 

const CreateTable = () => {
    const history = useHistory();
    const [tableName, setTableName] = useState('');
    const [capacity, setCapacity] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleTableNameChange = (event) => {
        setTableName(event.target.value);
    };

    const handleCapacityChange = (event) => {
        setCapacity(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (tableName.length < 2) {
            setErrorMessage('Table name must be at least 2 characters long.');
            return;
        }

        if (parseInt(capacity) < 1) {
            setErrorMessage('Capacity must be at least 1 person.');
            return;
        }

        try {
            const newTable = {
                table_name: tableName,
                capacity: parseInt(capacity),
            };
            await createTable(newTable);
            history.push('/dashboard');
        } catch (error) {
            console.error('Error creating table:', error);
            setErrorMessage('An error occurred while creating the table.');
        }
    };

    const handleCancel = () => {
        history.goBack(); 
    };

    return (
        <div>
            <h1>Create New Table</h1>
            <ErrorAlert  error={errorMessage} />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="table_name">Table name:</label>
                    <input
                        type="text"
                        id="table_name"
                        name="table_name"
                        value={tableName}
                        onChange={handleTableNameChange}
                        required
                        minLength={2}
                    />
                </div>
                <div>
                    <label htmlFor="capacity">Capacity:</label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={capacity}
                        onChange={handleCapacityChange}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CreateTable;