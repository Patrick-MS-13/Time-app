import React, { useState, useEffect } from "react";
import "./../style/timereminder.css"; // Ensure this path is correct
import sound from "./../audio/reminder.mp3"; // Import the audio file
import deleteIcon from "./../img/delete.svg"; // Import the delete SVG
import timealart from './../img/time-alert-2-svgrepo-com.svg'; // Import time alert SVG

const TimeReminder = () => {
  const [reminderTime, setReminderTime] = useState("");
  const [reminders, setReminders] = useState([]);
  const [reminderMessage, setReminderMessage] = useState(""); // Notification message
  const [reminderAudio, setReminderAudio] = useState(null); // Store the audio object for silencing
  const [isReminderPlaying, setIsReminderPlaying] = useState(false); // Track if the reminder is playing
  const [currentReminderId, setCurrentReminderId] = useState(null); // Track current ringing reminder ID
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
  const showNotification = (
    message,
    isPersistent = false,
    isBrowserNotification = true
  ) => {
    setReminderMessage(message);

    // Automatically clear the notification message after 5 seconds unless it’s the persistent ringing notification
    if (!isPersistent) {
      setTimeout(() => {
        setReminderMessage("");
      }, 5000); // Disappear after 5 seconds
    }

    // Create a browser notification if enabled
    if (isBrowserNotification && Notification.permission === "granted") {
      const notification = new Notification("Time Reminder", {
        body: message,
        icon: "/icon.png", // You can specify an icon if you want
        requireInteraction: isPersistent, // Prevent auto-dismiss for persistent notifications
      });

      // Add click event listener to the notification (for silencing reminder)
      notification.onclick = () => {
        if (isPersistent) {
          silenceReminder(); // Only silence when the notification is for the ringing reminder
        }
        notification.close(); // Close the notification when clicked
      };

      // Store the notification reference to close it later in silenceReminder
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
    const oneMinuteAhead = new Date(now.getTime() + 60 * 1000); // 1 minute ahead of the current time

    // If reminder is in the past or the same as the current time, show a dynamic message with current time
    if (reminderDate <= oneMinuteAhead) {
      const currentTimeFormatted = formatTime12Hour(now); // Get the current time in 12-hour format
      showNotification(
        `Please select a future time at least 1 minute from ${currentTimeFormatted}.`
      );
      return;
    }

    // Calculate the maximum reminder time (now + 23 hours + 59 minutes + 59 seconds)
    const maxReminderTime = new Date(
      now.getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000
    );

    // Ensure reminder is within the next 23 hours, 59 minutes, and 59 seconds
    if (reminderDate >= maxReminderTime) {
      showNotification(
        "Please select a time within the next 23 hours and 59 minutes."
      );
      return;
    }

    // Calculate the time difference in milliseconds
    const timeDifference = reminderDate - now;

    // Use a unique ID for each reminder
    const id = `${reminderDate.getTime()}-${Math.random()}`; // Create a unique ID using timestamp and random value

    // Set a timeout for the reminder
    const timeoutId = setTimeout(() => {
      const audio = new Audio(sound); // Use the imported audio file
      audio.loop = true; // Enable continuous play until silenced
      setReminderAudio(audio); // Store the audio object for later use
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
      setIsReminderPlaying(true); // Set reminder as playing
      setCurrentReminderId(id); // Store the current reminder ID
      const message = `Reminder: It's now ${formatTime12Hour(reminderDate)}`;
      showNotification(message, true); // Persistent notification for ringing reminder
    }, timeDifference);

    // Add the new reminder to the list
    setReminders((prevReminders) => [
      ...prevReminders,
      { id, time: reminderDate, timeoutId },
    ]);
    showNotification(`Reminder set for ${formatTime12Hour(reminderDate)}`); // Auto-dismissing notification
  };

  // Handle silencing the reminder
  const silenceReminder = () => {
    if (reminderAudio) {
      reminderAudio.pause(); // Stop the audio
      reminderAudio.currentTime = 0; // Reset the audio to the start
      setReminderAudio(null); // Clear the stored audio object
      setIsReminderPlaying(false); // Reset reminder playing state

      // Show notification that the reminder has been silenced
      setReminderMessage("Silenced."); // Set the message first
      setIsSilenced(true); // Mark as silenced
      const notificationElement = document.querySelector(".reminder-notification");
      notificationElement.classList.add("silenced"); // Then add the "silenced" class

      // Close the active notification if it exists
      if (activeNotification) {
        activeNotification.close(); // Manually close the browser notification
        setActiveNotification(null); // Clear the reference
      }

      // Remove the "silenced" class and clear the message after 5 seconds
      setTimeout(() => {
        notificationElement.classList.remove("silenced");
        setReminderMessage(""); // Clear the silenced notification after timeout
        setIsSilenced(false); // Reset silenced state
      }, 5000); // Clear after 5 seconds

      // Clear the reminder list after silencing
      setReminders([]); // Clear all reminders after silencing
    }
  };

  // Handle clearing a reminder
  const handleClearReminder = (id) => {
    const reminder = reminders.find((rem) => rem.id === id);
    if (reminder) {
      clearTimeout(reminder.timeoutId); // Clear the timeout
      setReminders((prevReminders) =>
        prevReminders.filter((rem) => rem.id !== id)
      ); // Remove from list

      // Show notification that the reminder has been cleared only when delete icon is clicked
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
      {/* Conditionally show time alert SVG or the reminder UI */}
      {!showTimeReminder ? (
        <img
          src={timealart}
          alt="Time Alert"
          className="time-alert-icon"
          onClick={() => setShowTimeReminder(true)} // Show the reminder UI on click
        />
      ) : (
        <>
          {/* Notification message display in the app */}
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
              .slice() // Create a shallow copy to avoid mutating state
              .sort((a, b) => a.time - b.time) // Sort reminders by time (earliest first)
              .map((reminder) => (
                <li key={reminder.id}>
                  {formatTime12Hour(reminder.time)}
                  <img
                    src={deleteIcon} // Use the imported delete icon
                    alt="Delete"
                    onClick={() => handleClearReminder(reminder.id)} // Call the clear function on click
                    className="delete-icon" // Optional: add a class for styling
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
