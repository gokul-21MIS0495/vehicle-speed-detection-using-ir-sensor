// src/PeakTime.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './peaktime.css';

const PeakTime = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [startHour, setStartHour] = useState('');
    const [endHour, setEndHour] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate time selection
        if (!startHour || !endHour) {
            alert('Please select both start and end hours.');
            return;
        }

        // Convert hours to numbers for comparison
        const start = parseInt(startHour, 10);
        const end = parseInt(endHour, 10);

        // Validate that start hour is less than end hour
        if (start >= end) {
            alert('Start hour must be less than end hour.');
            return;
        }

        // If validations pass, show result in result box
        setResult(`Displaying peak time data from ${startHour}:00 to ${endHour}:00`);
    };

    // Calculate the maximum date (current year + 2)
    const getMaxDate = () => {
        const max = new Date();
        max.setFullYear(max.getFullYear() + 2);
        return max;
    };

    // Determine if the submit button should be enabled
    const isSubmitEnabled = selectedDate && startHour && endHour;

    return (
        <div className="peak-time-container">
            <h2 className="peak-time-label">Peak Time Page</h2>
            <div className="panel">
                <form className="peak-time-form" onSubmit={handleSubmit}>
                    <label className="date-label">
                        Select Day:
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date('2015-01-01')}
                            maxDate={getMaxDate()}
                            placeholderText="Select a date"
                            className="date-picker"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                        />
                    </label>

                    <label className="time-label">
                        Select Start Hour:
                        <select
                            value={startHour}
                            onChange={(e) => setStartHour(e.target.value)}
                            className="hour-selector"
                        >
                            <option value="">--Select Start Hour--</option>
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}:00
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="time-label">
                        Select End Hour:
                        <select
                            value={endHour}
                            onChange={(e) => setEndHour(e.target.value)}
                            className="hour-selector"
                        >
                            <option value="">--Select End Hour--</option>
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}:00
                                </option>
                            ))}
                        </select>
                    </label>

                    <button type="submit" disabled={!isSubmitEnabled}>
                        Submit
                    </button>
                </form>

                <div className="result-panel">
                    <p>Result:</p>
                    <div className="result-content">{result}</div>
                </div>
            </div>
        </div>
    );
};

export default PeakTime;
