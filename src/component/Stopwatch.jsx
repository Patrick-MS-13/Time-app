import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './../style/stopwatch.css';
import stoptime from "./../img/stopwatch-svgrepo-com.svg";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);
  const [showStopwatch, setShowStopwatch] = useState(false);
  
  // Button state variables
  const [isStartDisabled, setIsStartDisabled] = useState(false);
  const [isStopDisabled, setIsStopDisabled] = useState(true);
  const [isResetDisabled, setIsResetDisabled] = useState(true);
  const [isLapDisabled, setIsLapDisabled] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setIsStartDisabled(true);
    setIsStopDisabled(false);
    setIsLapDisabled(false);
    setIsResetDisabled(false); // Enable Reset button when Start is clicked
  };

  const handleStop = () => {
    setIsActive(false);
    setIsStartDisabled(false);
    setIsStopDisabled(true);
    setIsLapDisabled(true);
    setIsResetDisabled(false); // Enable Reset button when Stop is clicked
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
    setIsStartDisabled(false);
    setIsStopDisabled(true);
    setIsResetDisabled(true);
    setIsLapDisabled(true);
  };

  const handleLap = () => {
    setLaps((prevLaps) => [...prevLaps, time]);
  };

  const handleDeleteLap = (index) => {
    setLaps((prevLaps) => prevLaps.filter((lap, i) => i !== index));
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, '0');
    const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const handleShowStopwatch = () => {
    setShowStopwatch(true);
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center">
      {!showStopwatch ? (
        <div onClick={handleShowStopwatch} style={{ cursor: 'pointer' }}>
          <img src={stoptime} alt="Stopwatch" width={100} height={100} />
        </div>
      ) : (
        <>
          <h1 className="text-center">{formatTime(time)}</h1>
          <div className="buttonContainer mb-3">
            <Button onClick={handleStart} text="Start" disabled={isStartDisabled} />
            <Button onClick={handleStop} text="Stop" disabled={isStopDisabled} />
            <Button onClick={handleReset} text="Reset" disabled={isResetDisabled} />
            <Button onClick={handleLap} text="Lap" disabled={isLapDisabled} />
          </div>
          {laps.length > 0 && (
            <div className="laps">
              <h2>Laps</h2>
              <ul className="list-group">
                {laps.slice().reverse().map((lap, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{`Lap ${laps.length - index}: ${formatTime(lap)}`}</span>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDeleteLap(laps.length - index - 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Button = ({ onClick, text, disabled }) => (
  <button onClick={onClick} className="btn btn-primary mx-1" disabled={disabled}>
    {text}
  </button>
);

export default Stopwatch;
