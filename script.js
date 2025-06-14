// Hamburger Menu Toggle (remains global)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburger.classList.toggle('active');
    });
}

// Active Nav Highlight (modified for multi-page)
const navLinks = document.querySelectorAll('header nav ul li a');
const currentPath = window.location.pathname.split('/').pop(); // Get current page filename

navLinks.forEach(link => {
    link.classList.remove('active'); // Remove active from all first
    // Check if the link's href matches the current page, or if it's home.html and no other page is active
    if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'home.html')) {
        link.classList.add('active');
    }
});


// Portfolio Filter (only for portfolio.html)
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}


// Lightbox (Simple version for project images - only for portfolio.html)
if (portfolioItems.length > 0) {
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('click', () => {
                const imgSrc = img.src;
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;';
                const largeImg = document.createElement('img');
                largeImg.src = imgSrc;
                largeImg.style.maxWidth = '90%';
                largeImg.style.maxHeight = '90%';
                overlay.appendChild(largeImg);
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => document.body.removeChild(overlay));
            });
        }
    });
}


// Radar Chart (Soft Skills Visualization - only for skills.html)
const canvas = document.getElementById("radarChart");
if (canvas) {
    const ctx = canvas.getContext("2d");
    // These values might need calibration if the canvas parent size changes significantly with the page split
    // Ensure the parent container for the canvas also has a defined height/width in CSS
    const centerX = canvas.width + 75; // Recalculated for centering
    const centerY = canvas.height + 200; // Recalculated for centering
    const radius = Math.min(canvas.width, canvas.height) * 1.5; // Make radius adaptive
    const labels = ["Communication", "Teamwork", "Problem Solving", "Adaptability", "Creativity"];
    const data = [90, 65, 80, 75, 95]; // Example data (0-100)

    function drawRadar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#00f7ff'; // Accent color
        ctx.lineWidth = 2;

        // Draw Web (concentric polygons)
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            for (let j = 0; j < labels.length; j++) {
                const angle = (Math.PI * 2 / labels.length) * j;
                const x = centerX + Math.cos(angle) * (radius * i / 5);
                const y = centerY + Math.sin(angle) * (radius * i / 5);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw Lines from center to labels
        ctx.strokeStyle = '#555';
        for (let j = 0; j < labels.length; j++) {
            const angle = (Math.PI * 2 / labels.length) * j;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            ctx.fillStyle = '#e0e0e0'; // Text color
            ctx.font = '14px Montserrat';
            ctx.textAlign = 'center';
            // Adjust text position to avoid overlap with lines
            const textOffset = 40; // Increased text offset
            const textX = centerX + Math.cos(angle) * (radius + textOffset);
            const textY = centerY + Math.sin(angle) * (radius + textOffset);
            ctx.fillText(labels[j], textX, textY);
        }

        // Draw Data Polygon
        ctx.beginPath();
        for (let j = 0; j < labels.length; j++) {
            const angle = (Math.PI * 2 / labels.length) * j;
            const value = data[j] / 100 * radius;
            const x = centerX + Math.cos(angle) * value;
            const y = centerY + Math.sin(angle) * value;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 247, 255, 0.3)'; // Semi-transparent accent color
        ctx.fill();
        ctx.strokeStyle = '#00f7ff'; // Accent color
        ctx.stroke();
    }

    // Set canvas dimensions dynamically or based on CSS container
    // Ensure that the parent container of the canvas has a defined size in CSS for these to work effectively.
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Redraw when window is resized
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        drawRadar();
    });

    drawRadar(); // Initial draw
}


// Contact Form Validation (Client-side - only for contact.html)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageTextarea = contactForm.querySelector('textarea[name="message"]');

        if (nameInput && nameInput.value.trim() === '') {
            markInvalid(nameInput);
            isValid = false;
        } else if (nameInput) {
            markValid(nameInput);
        }

        if (emailInput && (emailInput.value.trim() === '' || !isValidEmail(emailInput.value))) {
            markInvalid(emailInput);
            isValid = false;
        } else if (emailInput) {
            markValid(emailInput);
        }

        if (messageTextarea && messageTextarea.value.trim() === '') {
            markInvalid(messageTextarea);
            isValid = false;
        } else if (messageTextarea) {
            markValid(messageTextarea);
        }

        if (isValid) {
            // Using a custom modal/message box instead of alert()
            const messageBox = document.createElement('div');
            messageBox.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 10000;">
                    <div style="background: #302b63; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 247, 255, 0.5); text-align: center; color: #e0e0e0;">
                        <h3>Message Sent!</h3>
                        <p>Thank you for your message. This is a demo validation.</p>
                        <button class="close-message-box" style="margin-top: 20px; padding: 10px 20px; background: #00f7ff; border: none; border-radius: 5px; cursor: pointer; color: #1a1a2e; font-weight: bold;">Close</button>
                    </div>
                </div>
            `;
            document.body.appendChild(messageBox);
            messageBox.querySelector('.close-message-box').addEventListener('click', () => {
                document.body.removeChild(messageBox);
            });
            contactForm.reset();
        }
    });
}


function markInvalid(element) {
    element.style.border = '2px solid #ff4d4d'; // Red border for invalid
}

function markValid(element) {
    element.style.border = 'none'; // Remove border for valid
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Back to Top Button visibility and functionality (remains global)
const backToTopBtn = document.querySelector(".back-to-top");
if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


// Particle Network Background (only for home.html)
const particleNetworkContainer = document.querySelector('.particle-network');

if (particleNetworkContainer) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    particleNetworkContainer.appendChild(canvas);

    let particles = [];
    const particleCount = 100;
    const particleSize = 1.5;
    const particleSpeed = 0.5;
    const lineColor = 'rgba(0, 247, 255, 0.1)'; // Light blue with transparency
    const particleColor = '#00f7ff'; // Light blue
    const maxDistance = 100; // Max distance for lines

    let mouse = { x: null, y: null, radius: 150 }; // Increased radius for better interaction

    // Event listeners for mouse interaction
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        // Adjust for scroll position to keep interaction accurate on the page
        mouse.y = event.y + window.scrollY; 
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function Particle(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    Particle.prototype.update = function() {
        // Check for boundaries
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Repel particles from mouse
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = mouse.radius / distance;
                let directionX = (forceDirectionX * force) + this.directionX;
                let directionY = (forceDirectionY * force) + this.directionY;

                if (Math.abs(directionX) < 5 && Math.abs(directionY) < 5) { // Cap speed
                    this.x -= directionX;
                    this.y -= directionY;
                }
            } else if (distance < mouse.radius + 50) {
                // Attract particles slightly if they are just outside the repulsion zone
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                this.x += forceDirectionX * 0.1;
                this.y += forceDirectionY * 0.1;
            }
        }

        this.draw();
    };

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            let size = (Math.random() * 2 + 1) * particleSize;
            let x = Math.random() * (canvas.width - size * 2) + size;
            let y = Math.random() * (canvas.height - size * 2) + size;
            let directionX = (Math.random() * 2 - 1) * particleSpeed;
            let directionY = (Math.random() * 2 - 1) * particleSpeed;

            particles.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connectParticles();
    }

    // Set canvas dimensions and initialize on load and resize
    function resizeCanvas() {
        canvas.width = particleNetworkContainer.clientWidth;
        canvas.height = particleNetworkContainer.clientHeight;
        initParticles(); // Reinitialize particles on resize
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call
    animateParticles();
}
