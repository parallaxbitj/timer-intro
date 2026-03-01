document.addEventListener("DOMContentLoaded", () => {
    // Target date: 5th March
    let targetDate = new Date();
    targetDate.setMonth(2); // March is 2
    targetDate.setDate(5);
    targetDate.setHours(0, 0, 0, 0);

    // If we've already passed March 5th this year, set for next year
    if (new Date() > targetDate) {
        targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const wheelEl = document.getElementById("seconds-wheel");

    const totalNumbers = 60;
    const radius = 700; // Large radius for subtle curve
    const numbersArray = [];

    // Initialize wheel numbers
    for (let i = 0; i < totalNumbers; i++) {
        let numStr = i < 10 ? '0' + i : '' + i;
        let numEl = document.createElement("div");
        numEl.classList.add("wheel-number");
        numEl.textContent = numStr;
        
        let angleDeg = i * -6; 
        numEl.style.transform = `rotate(${angleDeg}deg) translateX(-${radius}px)`;
        
        wheelEl.appendChild(numEl);
        numbersArray.push(numEl);
    }

    function updateOpacities(currentSec) {
        for (let i = 0; i < totalNumbers; i++) {
            let diff = Math.abs(i - currentSec);
            if (diff > 30) {
                diff = 60 - diff;
            }
            
            let opacity = 0;
            if (diff === 0) opacity = 1.0;
            else if (diff === 1) opacity = 0.6;
            else if (diff === 2) opacity = 0.3;
            else if (diff === 3) opacity = 0.15;
            else if (diff <= 6) opacity = 0.05;
            else opacity = 0.01;

            numbersArray[i].style.opacity = opacity;
            
            // Highlight the current number slightly larger? (the original design keeps them all same size, but current is brightest)
            if (diff === 0) {
                numbersArray[i].style.fontWeight = "500";
            } else {
                numbersArray[i].style.fontWeight = "400";
            }
        }
    }

    function updateTimer() {
        const now = new Date();
        let diff = targetDate - now;

        if (diff <= 0) diff = 0; // Launch reached

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        daysEl.textContent = days < 10 ? '0' + days : days;
        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;

        // Update wheel rotation
        // S = seconds
        let wheelRotation = seconds * 6;
        wheelEl.style.transform = `rotate(${wheelRotation}deg)`;

        // Update opacities
        updateOpacities(seconds);
    }

    // Initialize and interval
    updateTimer();
    setInterval(updateTimer, 1000);
});
