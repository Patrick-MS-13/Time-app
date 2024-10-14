import React, { useState, useEffect } from "react";
import Select from "react-select";
import 'bootstrap/dist/css/bootstrap.min.css';
import './../style/timezonepicker.css';

const TimeZonePicker = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [timeDifference, setTimeDifference] = useState("00:00"); // Initialize time difference without seconds
  const [selectedLocationTime, setSelectedLocationTime] = useState(""); // Selected location time for display
  const [currentLocationTime, setCurrentLocationTime] = useState(""); // Current location time for display
  const [isAheadOrBehind, setIsAheadOrBehind] = useState(""); // State to track if selected time zone is ahead or behind

  useEffect(() => {
    const getTimeZones = () => {
      try {
        return Intl.supportedValuesOf("timeZone");
      } catch (err) {
        return [
          "America/New_York",
          "Europe/London",
          "Asia/Tokyo",
          "Australia/Sydney",
          "UTC",
        ];
      }
    };

    // Get the supported time zones and map them
    const supportedZones = getTimeZones().map((zone) => ({
      value: zone,
      label: zone,
    }));

    // Set time zones to state
    setTimeZones(supportedZones);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Get the current location time
      const currentOptions = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      const currentTime = now.toLocaleString("en-US", currentOptions);

      // Format current location time to dd/mm/yyyy with AM/PM
      const currentDateObj = new Date(currentTime);
      const formattedCurrentDate = `${String(currentDateObj.getDate()).padStart(2, '0')}/${String(currentDateObj.getMonth() + 1).padStart(2, '0')}/${currentDateObj.getFullYear()}`;
      const formattedCurrentTime = currentDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentLocationTime(`${formattedCurrentDate} | ${formattedCurrentTime}`); // Set formatted current location time

      if (selectedTimeZone) {
        // Get the selected time zone time
        const selectedOptions = {
          timeZone: selectedTimeZone,
        };
        const selectedTime = now.toLocaleString("en-US", selectedOptions);

        // Calculate time difference in seconds
        const selectedDateTime = new Date(selectedTime).getTime();
        const differenceInSeconds = Math.floor((selectedDateTime - now.getTime()) / 1000);

        // Convert difference to hh:mm format
        const hours = String(Math.floor(Math.abs(differenceInSeconds) / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((Math.abs(differenceInSeconds) % 3600) / 60)).padStart(2, '0');
        setTimeDifference(`${hours}:${minutes}`); // Set time difference without seconds

        // Determine if current time is ahead or behind
        if (differenceInSeconds > 0) {
          setIsAheadOrBehind("Ahead of the current location");
        } else if (differenceInSeconds < 0) {
          setIsAheadOrBehind("Behind the current location");
        } else {
          setIsAheadOrBehind("Both locations are at the same time");
        }

        // Format selected location time to dd/mm/yyyy with AM/PM
        const selectedDateObj = new Date(selectedTime);
        const formattedDate = `${String(selectedDateObj.getDate()).padStart(2, '0')}/${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}/${selectedDateObj.getFullYear()}`;
        const formattedTime = selectedDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        // Set formatted date and time with a vertical bar in between
        setSelectedLocationTime(`${formattedDate} | ${formattedTime}`);
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimeZone]);

  const handleTimeZoneChange = (selectedOption) => {
    setSelectedTimeZone(selectedOption.value);
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-3">
        <h4>{currentLocationTime}</h4>
      </div>
      <div className="timezone-picker-container border p-4 rounded shadow">
        <label htmlFor="timezone">Select Time Zone:</label>
        <Select
          id="timezone"
          options={timeZones}
          onChange={handleTimeZoneChange}
          placeholder="Search and select a time zone"
          className="mb-3"
        />
        {selectedTimeZone && (
          <div>
            <h3>{selectedTimeZone}</h3>
            <p>{selectedLocationTime}</p>
            <p>Time Difference: {timeDifference}</p>
            <p>{isAheadOrBehind}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeZonePicker;
