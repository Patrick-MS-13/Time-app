import React, { useState } from "react";
import StopwatchIcon from "./../img/stopwatch-svgrepo-com.svg"; // Import Stopwatch icon
import AlarmIcon from "./../img/alarm-plus-svgrepo-com.svg"; // Import Alarm icon
import TimeZonePickerIcon from "./../img/map-time-svgrepo-com.svg"; // Import TimeZonePicker icon
import TimeReminderIcon from "./../img/time-alert-2-svgrepo-com.svg"; // Import TimeReminder icon
import './../style/timeManagement.css'; // Import your CSS for styling
import Stopwatch from './Stopwatch'; // Import the Stopwatch component
import Alarm from './Alarm'; // Import the Alarm component
import TimeZonePicker from './TimeZonePicker'; // Import the TimeZonePicker component
import TimeReminder from './TimeReminder'; // Import the TimeReminder component
import Background from './Background'; // Import Background component

const TimeManagement = () => {
    const [currentTool, setCurrentTool] = useState(null); // Track the current selected tool

    // Function to handle tool selection
    const handleToolSelect = (tool) => {
        setCurrentTool(tool); // Set the current tool to the selected one
    };

    // Function to handle back button click
    const handleBackButtonClick = () => {
        setCurrentTool(null); // Reset the tool selection to go back to the main screen
    };

    return (
        <div className="app-container">
            <Background /> {/* Include Background component for stars and moon */}

            {/* Conditionally render the "Time Management App" title only when no tool is selected */}
            {!currentTool && <h1 className="app-title">Time Management App</h1>}

            {/* Conditionally render the icons (main page) or the selected tool */}
            {!currentTool ? (
                <div className="icon-container">
                    <img
                        src={StopwatchIcon} // Stopwatch icon
                        alt="Stopwatch"
                        title="Stopwatch" // Tooltip text
                        className="tool-icon" // Updated class for styling
                        onClick={() => handleToolSelect("stopwatch")}
                    />
                    <img
                        src={AlarmIcon} // Alarm icon
                        alt="Alarm"
                        title="Alarm" // Tooltip text
                        className="tool-icon" // Updated class for styling
                        onClick={() => handleToolSelect("alarm")}
                    />
                    <img
                        src={TimeZonePickerIcon} // TimeZonePicker icon
                        alt="Time Zone Picker"
                        title="Time Zone Picker" // Tooltip text
                        className="tool-icon" // Updated class for styling
                        onClick={() => handleToolSelect("timezonePicker")}
                    />
                    <img
                        src={TimeReminderIcon} // TimeReminder icon
                        alt="Time Reminder"
                        title="Time Reminder" // Tooltip text
                        className="tool-icon" // Updated class for styling
                        onClick={() => handleToolSelect("timeReminder")}
                    />
                </div>
            ) : (
                <div className="component-container"> {/* Updated class for styling */}
                    {currentTool === "stopwatch" && <Stopwatch />}
                    {currentTool === "alarm" && <Alarm />}
                    {currentTool === "timezonePicker" && <TimeZonePicker />}
                    {currentTool === "timeReminder" && <TimeReminder />}

                    {/* Back button to return to the main page */}
                    <button
                        onClick={handleBackButtonClick}
                        className="back-button"
                        style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            background: "#007bff",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease", // Smooth transition effect for hover
                        }}
                    >
                        Back
                    </button>

                </div>
            )}
        </div>
    );
};

export default TimeManagement;
