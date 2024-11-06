import React, { useState, useEffect } from "react";
import "./../style/timereminder.css"; // Ensure this path is correct
import sound from "./../audio/reminder.mp3"; // Import the audio file
import deleteIcon from "./../img/delete.svg"; // Import the delete SVG
import timeAlert from './../img/time-alert-2-svgrepo-com.svg'; // Import time alert SVG

const TimeReminder = () => {
  const [reminderTime, setReminderTime] = useState("");
  const [reminders, setReminders] = useState([]);
  const [reminderMessage, setReminderMessage] = useState(""); // Notification message
  const [reminderAudio, setReminderAudio] = useState(null); // Store the audio object for silencing
  const [isReminderPlaying, setIsReminderPlaying] = useState(false); // Track if the reminder is playing
  //const [currentReminderId, setCurrentReminderId] = useState(null); // Track current ringing reminder ID
  const [activeNotification, setActiveNotification] = useState(null); // Track active notification
  const [isSilenced, setIsSilenced] = useState(false); // Track if reminder is silenced
  const [showTimeReminder, setShowTimeReminder] = useState(false); // Control visibility of the reminder component

  // Request permission for browser notifications on component mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Notifications are not allowed");
        }
      });
    }
  }, []);

  // Helper function to format time in 12-hour format
  const formatTime12Hour = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to show notifications
  const showNotification = (message, isPersistent = false) => {
    setReminderMessage(message);

    // Automatically clear the notification message after 5 seconds unless it’s persistent
    if (!isPersistent) {
      setTimeout(() => {
        setReminderMessage("");
      }, 5000);
    }

    // Create a browser notification if enabled
    if (Notification.permission === "granted") {
      const notification = new Notification("Time Reminder", {
        body: message,
        icon: "/icon.png", // You can specify an icon if you want
        requireInteraction: isPersistent, // Prevent auto-dismiss for persistent notifications
      });

      notification.onclick = () => {
        if (isPersistent) {
          silenceReminder(); // Only silence when the notification is for the ringing reminder
        }
        notification.close();
      };

      if (isPersistent) {
        setActiveNotification(notification);
      }
    }
  };

  // Handle setting the reminder
  const handleSetReminder = () => {
    if (!reminderTime) {
      showNotification("Please select a time for the reminder.");
      return;
    }

    const now = new Date();
    const [hours, minutes] = reminderTime.split(":");
    const reminderDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    // Ensure the selected time is at least 1 minute in the future
    const oneMinuteAhead = new Date(now.getTime() + 60 * 1000);

    if (reminderDate <= oneMinuteAhead) {
      const currentTimeFormatted = formatTime12Hour(now);
      showNotification(
        `Please select a future time at least 1 minute from ${currentTimeFormatted}.`
      );
      return;
    }

    // Calculate the maximum reminder time (now + 23 hours + 59 minutes + 59 seconds)
    const maxReminderTime = new Date(
      now.getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000
    );

    if (reminderDate >= maxReminderTime) {
      showNotification(
        "Please select a time within the next 23 hours and 59 minutes."
      );
      return;
    }

    const timeDifference = reminderDate - now;
    const id = `${reminderDate.getTime()}-${Math.random()}`;

    const timeoutId = setTimeout(() => {
      const audio = new Audio(sound);
      audio.loop = true;
      setReminderAudio(audio);
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
      setIsReminderPlaying(true);
      //setCurrentReminderId(id);
      const message = `Reminder: It's now ${formatTime12Hour(reminderDate)}`;
      showNotification(message, true);
    }, timeDifference);

    setReminders((prevReminders) => [
      ...prevReminders,
      { id, time: reminderDate, timeoutId },
    ]);
    showNotification(`Reminder set for ${formatTime12Hour(reminderDate)}`);
  };

  // Handle silencing the reminder
  const silenceReminder = () => {
    if (reminderAudio) {
      reminderAudio.pause();
      reminderAudio.currentTime = 0;
      setReminderAudio(null);
      setIsReminderPlaying(false);
      setReminderMessage("Silenced.");
      setIsSilenced(true);

      if (activeNotification) {
        activeNotification.close();
        setActiveNotification(null);
      }

      setTimeout(() => {
        setReminderMessage(""); // Clear the silenced notification after timeout
        setIsSilenced(false);
      }, 5000);

      setReminders([]);
    }
  };

  // Handle clearing a reminder
  const handleClearReminder = (id) => {
    const reminder = reminders.find((rem) => rem.id === id);
    if (reminder) {
      clearTimeout(reminder.timeoutId);
      setReminders((prevReminders) =>
        prevReminders.filter((rem) => rem.id !== id)
      );

      if (!isSilenced) {
        showNotification(`Reminder for ${formatTime12Hour(reminder.time)} has been cleared.`);
      }
    }
  };

  // Handle time change from the input
  const handleTimeChange = (e) => {
    setReminderTime(e.target.value);
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      reminders.forEach((reminder) => clearTimeout(reminder.timeoutId));
    };
  }, [reminders]);

  return (
    <div className="time-reminder-container">
      {!showTimeReminder ? (
        <img
          src={timeAlert}
          alt="Time Alert"
          className="time-alert-icon"
          onClick={() => setShowTimeReminder(true)}
        />
      ) : (
        <>
          {reminderMessage && (
            <div
              className={`reminder-notification ${
                isReminderPlaying ? "slide-in reminder-active" : "slide-in"
              } ${isSilenced ? "silenced-notification" : ""}`}
            >
              {reminderMessage}
              {isReminderPlaying && (
                <button onClick={silenceReminder} className="silence-button">
                  Silence
                </button>
              )}
            </div>
          )}
          <h1>Time Reminder</h1>
          <input
            type="time"
            id="reminderTime"
            value={reminderTime}
            onChange={handleTimeChange}
            required
          />
          <button onClick={handleSetReminder}>Set Reminder</button>
          <ul>
            {reminders
              .slice()
              .sort((a, b) => a.time - b.time)
              .map((reminder) => (
                <li key={reminder.id}>
                  {formatTime12Hour(reminder.time)}
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    onClick={() => handleClearReminder(reminder.id)}
                    className="delete-icon"
                  />
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TimeReminder;
