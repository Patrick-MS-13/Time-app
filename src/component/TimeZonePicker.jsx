import React, { useState, useEffect } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../style/timezonepicker.css";
import mapSvg from "./../img/map-time-svgrepo-com.svg"; // Import the SVG

const TimeZonePicker = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [timeDifference, setTimeDifference] = useState("00:00");
  const [selectedLocationTime, setSelectedLocationTime] = useState("");
  const [currentLocationTime, setCurrentLocationTime] = useState("");
  const [isAheadOrBehind, setIsAheadOrBehind] = useState("");
  const [showTimeZonePicker, setShowTimeZonePicker] = useState(false); // Manage visibility of the time zone picker

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

    const supportedZones = getTimeZones().map((zone) => ({
      value: zone,
      label: zone,
    }));

    setTimeZones(supportedZones);
  }, []);

  useEffect(() => {
    if (!showTimeZonePicker) return; // Do nothing until the time zone picker is shown

    const updateTime = () => {
      const now = new Date();

      const currentOptions = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      const currentTime = now.toLocaleString("en-US", currentOptions);

      const currentDateObj = new Date(currentTime);
      const formattedCurrentDate = `${String(currentDateObj.getDate()).padStart(
        2,
        "0"
      )}/${String(currentDateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}/${currentDateObj.getFullYear()}`;
      const formattedCurrentTime = currentDateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentLocationTime(
        `${formattedCurrentDate} | ${formattedCurrentTime}`
      );

      if (selectedTimeZone) {
        const selectedOptions = {
          timeZone: selectedTimeZone,
        };
        const selectedTime = now.toLocaleString("en-US", selectedOptions);

        const selectedDateTime = new Date(selectedTime).getTime();
        const differenceInSeconds = Math.floor(
          (selectedDateTime - now.getTime()) / 1000
        );

        const hours = String(
          Math.floor(Math.abs(differenceInSeconds) / 3600)
        ).padStart(2, "0");
        const minutes = String(
          Math.floor((Math.abs(differenceInSeconds) % 3600) / 60)
        ).padStart(2, "0");
        setTimeDifference(`${hours}:${minutes}`);

        if (differenceInSeconds > 0) {
          setIsAheadOrBehind("Ahead of the current location");
        } else if (differenceInSeconds < 0) {
          setIsAheadOrBehind("Behind the current location");
        } else {
          setIsAheadOrBehind("Both locations are at the same time");
        }

        const selectedDateObj = new Date(selectedTime);
        const formattedDate = `${String(selectedDateObj.getDate()).padStart(
          2,
          "0"
        )}/${String(selectedDateObj.getMonth() + 1).padStart(
          2,
          "0"
        )}/${selectedDateObj.getFullYear()}`;
        const formattedTime = selectedDateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setSelectedLocationTime(`${formattedDate} | ${formattedTime}`);
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimeZone, showTimeZonePicker]);

  const handleTimeZoneChange = (selectedOption) => {
    setSelectedTimeZone(selectedOption.value);
  };

  const handleMapClick = () => {
    setShowTimeZonePicker(true); // Show time zone picker and current time when map is clicked
  };

  return (
    <div className="container mt-4">
      {/* Map SVG to trigger the view */}
      {!showTimeZonePicker && (
        <div className="text-center mb-3">
          <img
            src={mapSvg}
            alt="Map Icon"
            className="clickable-icon"
            onClick={handleMapClick}
          />
        </div>
      )}

      {/* Conditional rendering based on whether the map has been clicked */}
      {showTimeZonePicker && (
        <>
          <div className="text-center mb-3 current-location-time">
            <h4>{currentLocationTime}</h4> {/* Styled current location */}
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
        </>
      )}
    </div>
  );
};

export default TimeZonePicker;
