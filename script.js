// Harbor Wellness Massage - Interactive Features

// ===================================
// Sticky Header on Scroll
// ===================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===================================
// FAQ Accordion Functionality
// ===================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    // Close other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });

    // Toggle current item
    item.classList.toggle('active');
  });
});

// ===================================
// Form Validation & Submission
// ===================================
const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (flexible format, allows international prefix +)
const phoneRegex = /^[\+\d\s\-\(\)]+$/;

// Validate individual field
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  // Check if required field is empty
  if (field.hasAttribute('required') && value === '') {
    isValid = false;
  }

  // Email validation
  if (field.type === 'email' && value !== '' && !emailRegex.test(value)) {
    isValid = false;
  }

  // Phone validation
  if (field.type === 'tel' && value !== '' && !phoneRegex.test(value)) {
    isValid = false;
  }

  // Select validation
  if (field.tagName === 'SELECT' && value === '') {
    isValid = false;
  }

  // Update field styling
  if (isValid) {
    field.classList.remove('error');
  } else {
    field.classList.add('error');
  }

  return isValid;
}

// Add real-time validation on blur
const formInputs = bookingForm.querySelectorAll('.form-input, .form-select');
formInputs.forEach(input => {
  input.addEventListener('blur', () => {
    validateField(input);
  });

  // Remove error on input
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      input.classList.remove('error');
    }
  });
});

// Form submission handler
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const massageType = document.getElementById('massageType');

  const isFullNameValid = validateField(fullName);
  const isEmailValid = validateField(email);
  const isPhoneValid = validateField(phone);
  const isMassageTypeValid = validateField(massageType);

  // Check if all fields are valid
  if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isMassageTypeValid) {
    return;
  }

  // Prepare data for webhook
  const formData = {
    name: fullName.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    massage_type: massageType.value
  };

  // Disable submit button
  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;

  try {
    // Send POST request to webhook
    const response = await fetch('https://n8n.artdecercles.fr/webhook-test/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // Show success message
      successMessage.classList.add('show');

      // Hide form
      bookingForm.style.display = 'none';

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Reset form
      bookingForm.reset();

      // Optional: Reset form display after some time
      setTimeout(() => {
        bookingForm.style.display = 'block';
        successMessage.classList.remove('show');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }, 10000); // Reset after 10 seconds

    } else {
      throw new Error('Submission failed');
    }

  } catch (error) {
    console.error('Error submitting form:', error);
    alert('There was an error submitting your booking request. Please try again or call us directly at (415) 555-0148.');
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
});

// ===================================
// Entrance Animations (Optional)
// ===================================
// Add subtle fade-in animations when elements come into view
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe cards and sections for animation
document.querySelectorAll('.card, .feature-card, .team-member').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});
