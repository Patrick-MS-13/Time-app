import React, { useState, useEffect, useCallback } from "react";
import "./../style/alarm.css"; // Ensure your CSS file is correctly linked
import add from "./../img/add.svg"; // Import your new SVG
import Delete from "./../img/delete.svg"; // Import your delete SVG
import alarm from "./../img/alarm-plus-svgrepo-com.svg"; // Import your alarm SVG
// import labeltag from "./../img/label.svg"
// import sound from "./../audio/reminder.mp3"

const Alarm = () => {
  const [alarmTime, setAlarmTime] = useState("");
  const [alarms, setAlarms] = useState([]); // Array to hold all alarms
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmMessage, setAlarmMessage] = useState(""); // Notification message
  const [showForm, setShowForm] = useState(false); // Control visibility of form
  const [showCheckboxes, setShowCheckboxes] = useState(false); // Control checkbox display
  const [selectedAlarms, setSelectedAlarms] = useState({}); // Track selected alarms for deletion
  const [showDeleteButton, setShowDeleteButton] = useState(false); // New state for delete button visibility
  const [showAlarmClock, setShowAlarmClock] = useState(false); // State to control visibility of the alarm clock
  const [ringingAlarmId, setRingingAlarmId] = useState(null); 
  // const audio = new Audio(sound); // Create audio instance


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Removed dependency on alarms
  
  useEffect(() => {
    checkAlarms(currentTime);
  }, [currentTime, alarms,checkAlarms]); 

  // Function to stop the alarm
const stopAlarm = () => {
  setAlarms((prevAlarms) =>
    prevAlarms.map((alarm) => {
      if (alarm.id === ringingAlarmId) {
        return { ...alarm, isActive: false }; // Deactivate the ringing alarm
      }
      return alarm;
    })
  );
  setRingingAlarmId(null); // Clear the ringing alarm ID
};

// Function to snooze the alarm for 5 minutes
const snoozeAlarm = () => {
  setAlarms((prevAlarms) =>
    prevAlarms.map((alarm) => {
      if (alarm.id === ringingAlarmId) {
        const [hours, minutes] = alarm.time24.split(":").map(Number);
        const snoozedTime = new Date();
        snoozedTime.setHours(hours);
        snoozedTime.setMinutes(minutes + 5);
        const newTime24 = `${snoozedTime.getHours().toString().padStart(2, "0")}:${snoozedTime.getMinutes().toString().padStart(2, "0")}`;
        return { ...alarm, time24: newTime24 };
      }
      return alarm;
    })
  );
  setRingingAlarmId(null);
};

const checkAlarms = useCallback(
  (now) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) => {
        const [alarmHours, alarmMinutes] = alarm.time24.split(":").map(Number);
        const alarmDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          alarmHours,
          alarmMinutes
        );

        if (
          now.getHours() === alarmHours &&
          now.getMinutes() === alarmMinutes &&
          alarm.isActive
        ) {
          setRingingAlarmId(alarm.id); // Set ringing alarm
        }

        if (alarmDate < now) {
          alarmDate.setDate(alarmDate.getDate() + 1); // Adjust for the next day
        }

        // Return alarm unchanged for now; implement disabling logic if needed
        return alarm;
      })
    );

    // Clear the alarm message after 5 seconds
    setTimeout(() => {
      setAlarmMessage(""); // Clear alarm message
    }, 5000);
  },
  [setAlarms, setRingingAlarmId, setAlarmMessage] // Add dependencies here
);


  const handleSetAlarm = () => {
    if (alarmTime) {
      const newAlarm = {
        time24: alarmTime,
        time12: formatAlarmTime(alarmTime),
        id: Date.now(),
        isActive: true,
      };
      setAlarms((prev) => [...prev, newAlarm]);
      setAlarmMessage(`Alarm set for ${newAlarm.time12}`);
      setAlarmTime("");
      setShowForm(false); // Hide form after setting the alarm
      setShowDeleteButton(true); // Show the delete button when an alarm is set

      // Clear the alarm message after 3 seconds
      setTimeout(() => {
        setAlarmMessage("");
      }, 3000);
    } else {
      setAlarmMessage("Please enter a valid time");
      // Clear the alarm message after 3 seconds
      setTimeout(() => {
        setAlarmMessage("");
      }, 3000);
    }
  };

  const formatAlarmTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const calculateRemainingTime = (alarm) => {
    const [alarmHours, alarmMinutes] = alarm.time24.split(":").map(Number);
    const now = new Date();
    const alarmDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      alarmHours,
      alarmMinutes
    );

    if (alarmDate < now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    return alarmDate.getTime() - now.getTime(); // Return the difference in milliseconds
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) =>
      prev.map((alarm) => {
        if (alarm.id === id) {
          const updatedAlarm = { ...alarm, isActive: !alarm.isActive };
          setAlarmMessage(
            updatedAlarm.isActive
              ? `Alarm re-enabled for ${updatedAlarm.time12}`
              : `Alarm disabled for ${updatedAlarm.time12}`
          );
          return updatedAlarm;
        }
        return alarm; // Return unchanged if it's not the selected alarm
      })
    );

    // Clear the alarm message after 3 seconds
    setTimeout(() => {
      setAlarmMessage("");
    }, 3000);
  };

  const toggleCheckbox = (id) => {
    setSelectedAlarms((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the selected state for the alarm
    }));
  };

  const deleteSelectedAlarms = () => {
    const deletedAlarms = alarms.filter((alarm) => selectedAlarms[alarm.id]);
    setAlarms((prev) => prev.filter((alarm) => !selectedAlarms[alarm.id])); // Delete selected alarms
    setSelectedAlarms({}); // Clear selected alarms
    setShowCheckboxes(false); // Hide checkboxes

    if (deletedAlarms.length > 0) {
      setAlarmMessage(`Deleted ${deletedAlarms.length} selected alarm(s).`);
    } else {
      setAlarmMessage("No alarms were selected for deletion.");
    }

    // Clear the alarm message after 5 seconds
    setTimeout(() => {
      setAlarmMessage("");
    }, 5000);
  };

  const handleDeleteClick = () => {
    if (alarms.length === 0) {
      setAlarmMessage("No alarms were set for deletion.");
      setTimeout(() => {
        setAlarmMessage("");
      }, 3000);
    } else if (showCheckboxes) {
      deleteSelectedAlarms();
    } else {
      setShowCheckboxes(true);
    }
  };

  const sortedAlarms = [...alarms].sort(
    (a, b) => calculateRemainingTime(a) - calculateRemainingTime(b)
  );

  return (
    <div className="container">
      {alarmMessage && <div className="notification">{alarmMessage}</div>}

      {ringingAlarmId && (
    <div className="notification">
        <p>Alarm ringing for {alarms.find(alarm => alarm.id === ringingAlarmId)?.time12}!</p>
        <button onClick={stopAlarm} className="stop-button">Stop</button>
        <button onClick={snoozeAlarm} className="snooze-button">Snooze</button>
    </div>
)}

      <div className="timeDisplay">
        {showAlarmClock && (
          <>
            <h4>
              {currentTime
                .toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
                .split(" ")
                .map((part, index) =>
                  index === 1 ? (
                    <span key={index} className="ampm">
                      {part}
                    </span>
                  ) : (
                    <span key={index} className="time">
                      {part}
                    </span>
                  )
                )}
            </h4>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: showForm || (showDeleteButton && alarms.length > 0) ? "space-between" : "center",
              }}
            >
              {/* Show Add Alarm SVG if the time picker is not showing */}
              {!showForm && (
                <div
                  onClick={() => {
                    setShowForm((prev) => !prev); // Toggle the form visibility
                    setShowDeleteButton(false);
                  }}
                  style={{ cursor: "pointer", position: "relative" }}
                  title="Add Alarm" // Tooltip for Add SVG
                >
                  <img src={add} alt="Add Alarm" width="50" height="50" />
                </div>
              )}

              {/* Show Delete button only if there are alarms and showDeleteButton is true */}
              {showDeleteButton && alarms.length > 0 && (
                <div
                  onClick={handleDeleteClick}
                  style={{ cursor: "pointer", position: "relative" }}
                  title="Delete Selected Alarms" // Tooltip for Delete SVG
                >
                  <img
                    src={Delete}
                    alt="Delete Selected Alarms"
                    width="50"
                    height="50"
                  />
                </div>
              )}
            </div>
            {showForm && (
              <div className="button-container">
                <input
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                  className="input"
                />
                <button
                  onClick={handleSetAlarm}
                  className="button"
                  style={{
                    width: "175px",
                    height: "46px",
                    margin: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Set Alarm
                </button>
              </div>
            )}
            {sortedAlarms.length > 0 && (
              <div className="alarm-list">
                <ul>
                  {sortedAlarms.map((alarm) => (
                    <li
                      key={alarm.id}
                      className="glassy-effect"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "10px 0",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          textAlign: "left",
                          padding: "0px 100px 0px 0px",
                          color: "white"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.5em",
                            display: "flex",
                            alignItems: "baseline",
                          }}
                        >
                          <span>{alarm.time12.split(" ")[0]}</span>{" "}
                          <span style={{ fontSize: "0.4em", marginLeft: "5px" }}>
                            {alarm.time12.split(" ")[1]}
                          </span>{" "}
                        </div>
                        <div style={{ fontSize: "0.6em", marginTop: "2px" }}>
                          {alarm.isActive
                            ? `Alarm in ${Math.floor(
                              calculateRemainingTime(alarm) / (1000 * 60 * 60)
                            )}h ${Math.floor(
                              (calculateRemainingTime(alarm) % (1000 * 60 * 60)) /
                              (1000 * 60)
                            )}m ${Math.floor(
                              (calculateRemainingTime(alarm) % (1000 * 60)) / 1000
                            )}s`
                            : "Alarm Disabled"}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {showCheckboxes ? (
                          <label className="round-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedAlarms[alarm.id] || false}
                              onChange={() => toggleCheckbox(alarm.id)}
                              style={{ display: "none" }} // Hide the default checkbox
                            />
                            <span className="checkmark"></span>
                          </label>
                        ) : (
                          <label className="switch" style={{ marginLeft: "10px" }}>
                            <input
                              type="checkbox"
                              checked={alarm.isActive}
                              onChange={() => toggleAlarm(alarm.id)}
                              style={{ display: "none" }} // Hide the default checkbox
                            />
                            <span
                              className={`slider ${alarm.isActive ? "" : "round"}`}
                              style={{ width: "49px", height: "22px" }} // Adjust slider size
                            ></span>
                          </label>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Show only the alarm SVG initially */}
        {!showAlarmClock && (
          <div
            onClick={() => setShowAlarmClock(true)}
            style={{ cursor: "pointer", display: "flex", justifyContent: "center", marginTop: "20px" }}
          >
            <img src={alarm} alt="Alarm Clock" width="100" height="100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Alarm;
