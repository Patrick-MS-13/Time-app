// src/component/TimeManagement.js
import React, { useState } from 'react';
import Stopwatch from './Stopwatch';
import Alarm from './Alarm';
import stopwatchIcon from '../img/stopwatch-svgrepo-com.svg'; // Adjust the path if needed
import alarmIcon from '../img/alarm-plus-svgrepo-com.svg'; // Adjust the path if needed
import './../style/timeManagement.css'; // Import a CSS file for styles

const TimeManagement = () => {
  const [showStopwatch, setShowStopwatch] = useState(false); // Initially hide Stopwatch
  const [showAlarm, setShowAlarm] = useState(false); // Initially hide Alarm

  const handleStopwatchClick = () => {
    setShowStopwatch(true); // Show Stopwatch when clicked
    setShowAlarm(false); // Hide Alarm
  };

  const handleAlarmClick = () => {
    setShowAlarm(true); // Show Alarm when clicked
    setShowStopwatch(false); // Hide Stopwatch
  };

  return (
    <div className="component-container">
      {/* Directly show the selected component based on the SVG click */}
      {showStopwatch && <Stopwatch />} {/* Render Stopwatch if active */}
      {showAlarm && <Alarm />} {/* Render Alarm if active */}

      {/* If neither component is visible, show the icons */}
      {!showStopwatch && !showAlarm && (
        <div className="icon-container">
          <div className="icon" onClick={handleStopwatchClick}>
            <img src={stopwatchIcon} alt="Stopwatch" className="icon-image stopwatch-icon" />
          </div>
          <div className="icon" onClick={handleAlarmClick}>
            <img src={alarmIcon} alt="Alarm" className="icon-image alarm-icon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeManagement;
