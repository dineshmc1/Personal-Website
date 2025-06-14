// Smooth Scroll Navigation
const navLinks = document.querySelectorAll('header nav ul li a');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('show');
  hamburger.classList.toggle('active');
});

// Active Nav Highlight on Scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100; // Adjust offset for fixed header
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

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

// Lightbox (Simple version for project images)
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

// Radar Chart (Soft Skills Visualization)
const canvas = document.getElementById("radarChart");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width + 25;
  const centerY = canvas.height * 2;
  const radius = 200; // Increased radius for desired size
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
  canvas.width = canvas.parentElement.clientWidth; // Use parent container width
  canvas.height = canvas.parentElement.clientHeight; // Use parent container height

  // Redraw when window is resized
  window.addEventListener('resize', () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawRadar();
  });

  drawRadar(); // Initial draw
}

// Contact Form Validation (Client-side)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const messageTextarea = contactForm.querySelector('textarea[name="message"]');

    if (nameInput.value.trim() === '') {
      markInvalid(nameInput);
      isValid = false;
    } else {
      markValid(nameInput);
    }

    if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
      markInvalid(emailInput);
      isValid = false;
    } else {
      markValid(emailInput);
    }

    if (messageTextarea.value.trim() === '') {
      markInvalid(messageTextarea);
      isValid = false;
    } else {
      markValid(messageTextarea);
    }

    if (isValid) {
      alert('Form submitted successfully (This is a demo validation)!');
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

// Back to Top Button visibility and functionality
const backToTopBtn = document.querySelector(".back-to-top");
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