// Hero Slideshow
const heroImages = ["hero-image-1.jpg", "hero-image-2.jpg", "hero-image-3.jpg"]; // Replace with your image paths
let currentImageIndex = 0;

function changeHeroImage() {
    const heroSection = document.querySelector(".hero-slideshow");
    heroSection.style.backgroundImage = `url(${heroImages[currentImageIndex]})`;

    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
}

setInterval(changeHeroImage, 3000); // Change image every 3 seconds


// Simple Form Validation
const contactForm = document.querySelector(".contact form");

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const nameInput = document.querySelector(".contact input[type='text']");
    const emailInput = document.querySelector(".contact input[type='email']");

    let hasErrors = false;

    if (nameInput.value.trim() === "") {
        alert("Please enter your name");
        hasErrors = true;
    }

    if (!validateEmail(emailInput.value)) {
        alert("Please enter a valid email address");
        hasErrors = true;
    }

    if (!hasErrors) {
        // If no errors, you would submit the form data (usually to a server)
        alert("Form submitted!"); 
    }
});

function validateEmail(email) {
    // A basic email validation pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
}
