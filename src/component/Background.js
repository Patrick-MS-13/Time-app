import React, { useEffect } from 'react';
import './../style/background.css'; // Import the CSS for the background

const Background = () => {
  // Function to create a shooting star
  const createShootingStar = () => {
    const star = document.createElement("div");
    star.className = "shooting-star"; // Assign shooting star class

    // Set a random position for the shooting star
    const randomTop = Math.random() * 50; // Random vertical position (0% to 50%)
    const randomLeft = Math.random() * 100; // Random horizontal position (0% to 100%)

    // Append the tail as a child of the star
    const tail = document.createElement("div");
    tail.className = "tail"; // Assign tail class

    star.style.top = `${randomTop}vh`; // Set the vertical position
    star.style.left = `${randomLeft}vw`; // Set the horizontal position
    star.appendChild(tail); // Append the tail to the star

    // Append the star to the body or a specific container
    document.body.appendChild(star);

    // Reset the animation
    star.style.animation = 'none'; // Reset the animation
    void star.offsetHeight; // Trigger a reflow to restart the animation
    star.style.animation = 'shoot 1s forwards'; // Restart the animation

    // Remove the star from the DOM after the animation completes
    setTimeout(() => {
      star.remove(); // Remove the shooting star from the DOM
    }, 1000); // Match this with the duration of the animation
  };

  // Generate random positions for stars
  const generateStars = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      const top = Math.random() * 100; // Random top position (0 to 100%)
      const left = Math.random() * 100; // Random left position (0 to 100%)
      stars.push({ top, left });
    }
    return stars;
  };

  const stars = generateStars(100); // Generate 100 stars

  // Call the createShootingStar function every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(createShootingStar, 5000);
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // JSX for the Background component
  return (
    <div className="sky">
      {/* Moon Icon */}
      <div
        className="moon-emoji"
        style={{
          fontSize: "100px",
          position: "absolute",
          top: "1%",
          left: "80%",
          transform: "translateX(-50%)",
          textShadow: "rgb(233 233 39 / 94%) 0px 0px 40px"
        }}
      >
        🌙
      </div>

      {/* Static Stars */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{ top: `${star.top}%`, left: `${star.left}%` }}
        />
      ))}
    </div>
  );
};

export default Background;
