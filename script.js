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

    // Responsive wheel radius calculation
    function getWheelRadius() {
        const vw = window.innerWidth;
        if (vw <= 360) return 180;
        if (vw <= 480) return 250;
        if (vw <= 768) return 350;
        if (vw <= 1024) return 500;
        return 700;
    }

    let radius = getWheelRadius();
    const totalNumbers = 60;
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

    // Handle window resize
    window.addEventListener('resize', () => {
        const newRadius = getWheelRadius();
        if (newRadius !== radius) {
            radius = newRadius;
            // Update all wheel numbers with new radius
            numbersArray.forEach((numEl, i) => {
                let angleDeg = i * -6;
                numEl.style.transform = `rotate(${angleDeg}deg) translateX(-${radius}px)`;
            });
        }
    });

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
    let mainTimerInterval = setInterval(updateTimer, 1000);

    /* ========================================= */
    /* --- PHASE 1: PARALLAX INTRO ANIMATION --- */
    /* ========================================= */

    // 1. CANVAS PARTICLES
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animationFrameId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // 2. CLICK TO ENTER LOGIC 
    const introScreen = document.getElementById('intro-screen');
    const mainTimerContainer = document.getElementById('main-timer-container');
    const backgroundVideo = document.getElementById('background-video');

    introScreen.addEventListener('click', () => {
        // Fade out intro
        introScreen.classList.add('fade-out');

        // Stop canvas animation to save CPU
        setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            introScreen.style.display = 'none';
        }, 800); // match CSS transition duration

        // Reveal Main Timer
        mainTimerContainer.style.display = 'block';

        // Trigger reflow to ensure opacity transition works
        void mainTimerContainer.offsetWidth;
        mainTimerContainer.style.opacity = '1';

        // Play video if it was paused
        if (backgroundVideo) {
            backgroundVideo.play().catch(e => console.log("Autoplay prevented", e));
        }
    });

});
