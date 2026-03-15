// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyABTVp797tNu353FBVLzsOp90aIX2mNF74",
  authDomain: "my-website-project2797.firebaseapp.com",
  projectId: "my-website-project2797",
  storageBucket: "my-website-project2797.appspot.com",
  messagingSenderId: "406226552922",
  appId: "1:406226552922:web:ffdf2ccf6f77a57964b063"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init("VgDakmh3WscKrr_wQ");
}

const db = firebase.firestore();
let currentUser = null;
const adminEmail = "gonahhomes0@gmail.com";

// Utility Functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Mobile Navigation
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }
}

// Booking Modal Functions
function openBookingModal(house) {
  const modal = document.getElementById('booking-modal-bg');
  const form = document.getElementById('booking-form');
  const confirmDiv = document.getElementById('booking-confirm');
  const summaryDiv = document.getElementById('booking-summary');

  if (modal && form && confirmDiv) {
    modal.classList.add('active');
    document.getElementById('booking-house').value = house;
    form.style.display = 'block';
    confirmDiv.style.display = 'none';
    if (summaryDiv) summaryDiv.style.display = 'none';
    form.reset();

    if (typeof initializeFlatpickr === 'function') {
      initializeFlatpickr(house);
    }
  }
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal-bg');
  if (modal) {
    modal.classList.remove('active');
  }
}

function openBookingConfirmation() {
  const name = document.getElementById("booking-name").value.trim();
  const email = document.getElementById("booking-email").value.trim();
  const phone = document.getElementById("booking-phone").value.trim();
  const guests = document.getElementById("booking-guests").value;
  const checkin = document.getElementById("booking-checkin").value;
  const checkout = document.getElementById("booking-checkout").value;

  if (!name || !email || !phone || !guests || !checkin || !checkout) {
    alert("Please fill all required fields.");
    return;
  }

  document.getElementById("booking-form").style.display = "none";
  document.getElementById("booking-confirmation").style.display = "block";

  document.getElementById("confirm-summary").innerHTML = `
    <div class="confirm-row"><strong>Name:</strong> ${name}</div>
    <div class="confirm-row"><strong>Email:</strong> ${email}</div>
    <div class="confirm-row"><strong>Phone:</strong> ${phone}</div>
    <div class="confirm-row"><strong>Guests:</strong> ${guests}</div>
    <div class="confirm-row"><strong>Check-In:</strong> ${checkin}</div>
    <div class="confirm-row"><strong>Check-Out:</strong> ${checkout}</div>
    <div class="confirm-row"><strong>Nights:</strong> ${document.getElementById("summary-nights").textContent}</div>
    <div class="confirm-row"><strong>Total:</strong> ${document.getElementById("summary-total").textContent}</div>
  `;
}

function backToBookingForm() {
  document.getElementById("booking-confirmation").style.display = "none";
  document.getElementById("booking-form").style.display = "block";
}

function showBookingConfirmation(bookingData) {
  const form = document.getElementById('booking-form');
  const confirmStep = document.getElementById('booking-confirmation');
  const confirmDiv = document.getElementById('booking-confirm');
  const detailsDiv = document.getElementById('booking-details');
  const codeDisplays = document.querySelectorAll('#display-booking-code');

  console.log("Showing confirmation for ID:", bookingData.id);

  if (confirmStep) confirmStep.style.display = 'none';
  if (form) form.style.display = 'none';
  
  if (confirmDiv && detailsDiv) {
    confirmDiv.style.display = 'block';
    
    if (codeDisplays.length > 0) {
        codeDisplays.forEach(el => {
            el.textContent = bookingData.id;
            el.style.display = 'inline';
        });
    }

    detailsDiv.innerHTML = `
      <div class="booking-summary-box" style="background: rgba(128, 0, 0, 0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(128, 0, 0, 0.1); margin-bottom: 1.5rem;">
        <p style="margin-bottom: 0.5rem;"><strong>Property:</strong> ${bookingData.house}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Guest:</strong> ${bookingData.name}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Check-in:</strong> ${formatDate(bookingData.checkin)}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Check-out:</strong> ${formatDate(bookingData.checkout)}</p>
        <p style="margin-top: 1rem; font-weight: 600; color: var(--primary-color);">Booking ID: ${bookingData.id}</p>
      </div>
      <div style="background: #fff8e1; padding: 1rem; border-radius: 8px; border: 1px solid #ffe082; margin-top: 1rem;">
        <p style="font-size: 0.9rem; color: #856404; margin: 0;">
          <i class="fas fa-info-circle"></i> Use your <strong>Booking ID</strong> and <strong>Email</strong> to access your account dashboard later.
        </p>
      </div>
    `;
  }
}

function submitBookingFinal() {
  const name = document.getElementById("booking-name").value.trim();
  const email = document.getElementById("booking-email").value.trim();
  const phone = document.getElementById("booking-phone").value.trim();
  const guests = document.getElementById("booking-guests").value;
  const checkin = document.getElementById("booking-checkin").value;
  const checkout = document.getElementById("booking-checkout").value;
  const house = document.getElementById("booking-house").value;
  
  const bookingData = {
    name, email, phone, guests, checkin, checkout, house
  };

  const bookingId = 'GNH-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  const finalBookingData = {
    ...bookingData,
    id: bookingId, // Use bookingId here
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'pending'
  };

  db.collection("bookings").doc(bookingId).set(finalBookingData).then(() => {
    showBookingConfirmation(finalBookingData);
    
    // Send email via EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.send("service_ky2kj3t", "template_6duvs5n", {
            to_name: finalBookingData.name,
            to_email: finalBookingData.email,
            booking_id: bookingId,
            property: finalBookingData.house,
            checkin: finalBookingData.checkin,
            checkout: finalBookingData.checkout
        }).then(() => console.log("Email sent")).catch(err => console.error("Email failed", err));
    }

    db.collection("messages").add({
      name: "System",
      email: "system@gonahhomes.com",
      message: `New booking: ${bookingId} for ${finalBookingData.house} by ${finalBookingData.name}`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'new'
    });
  }).catch((error) => {
    console.error("Error saving booking: ", error);
    alert("Error processing booking: " + error.message);
  });
}

// Review System Functions
function showUserInfo(email) {
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const emailForm = document.getElementById('email-form');
  const reviewForm = document.getElementById('review-form');

  if (userInfo && userName && userEmail && emailForm && reviewForm) {
    userInfo.style.display = 'block';
    userName.textContent = email.split('@')[0];
    userEmail.textContent = email;
    reviewForm.style.display = 'block';
    emailForm.style.display = 'none';
  }
}

function hideUserInfo() {
  const userInfo = document.getElementById('user-info');
  const emailForm = document.getElementById('email-form');
  const reviewForm = document.getElementById('review-form');

  if (userInfo && emailForm && reviewForm) {
    userInfo.style.display = 'none';
    emailForm.style.display = 'block';
    reviewForm.style.display = 'none';
  }
}

function renderTestimonials(reviews) {
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (!testimonialsGrid) return;

  if (!reviews || reviews.length === 0) {
    testimonialsGrid.innerHTML = `
      <div class="testimonial-card">
        <div class="testimonial-rating">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <p class="testimonial-text">"Amazing experience! The apartment was spotless, beautifully furnished, and the location was perfect. Will definitely book again!"</p>
        <div class="testimonial-author">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b577?w=100&h=100&fit=crop&crop=face" alt="Sarah Johnson" class="author-avatar">
          <div class="author-info">
            <h4>Sarah Johnson</h4>
            <span>Verified Guest</span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  reviews.slice(0, 6).forEach(review => {
    const rating = '★'.repeat(Number(review.rating || 5));
    const reviewDate = review.timestamp ? new Date(review.timestamp.toDate()).toLocaleDateString() : '';
    const userName = review.name || 'Anonymous';
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=100&background=800000&color=fff`;

    html += `
      <div class="testimonial-card">
        <div class="testimonial-rating">
          ${rating.split('').map(() => '<i class="fas fa-star"></i>').join('')}
        </div>
        <p class="testimonial-text">"${review.review}"</p>
        ${review.imageUrl ? `<div class="testimonial-image" style="margin: 1rem 0;"><img src="${review.imageUrl}" style="width: 100%; border-radius: 8px; max-height: 200px; object-fit: cover;"></div>` : ''}
        <div class="testimonial-author">
          <img src="${userAvatar}" alt="${userName}" class="author-avatar">
          <div class="author-info">
            <h4>${userName}</h4>
            <span>Verified Guest ${reviewDate ? '• ' + reviewDate : ''}</span>
          </div>
        </div>
      </div>
    `;
  });

  testimonialsGrid.innerHTML = html;
}

function loadReviews() {
  db.collection("reviews").where("approved", "==", true).orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    const reviews = [];
    snapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    renderTestimonials(reviews);
  }, (error) => {
    console.error("Error loading reviews: ", error);
    renderTestimonials([]);
  });
}

// New Review Validation Logic
const validationForm = document.getElementById('review-validation-form');
const submissionForm = document.getElementById('review-submission-form');
let verifiedReviewer = null;

if (validationForm) {
  validationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('review-email-input').value.trim();
    const code = document.getElementById('review-code-input').value.trim();
    
    try {
      const snapshot = await db.collection('bookings')
        .where('email', '==', email)
        .where('id', '==', code)
        .get();
        
      if (snapshot.empty) {
        alert("No matching booking found. Please check your email and code.");
        return;
      }
      
      const b = snapshot.docs[0].data();
      verifiedReviewer = { email, code, name: b.name };
      validationForm.style.display = 'none';
      submissionForm.style.display = 'block';
      document.getElementById('reviewer-badge').innerHTML = `<i class="fas fa-check-circle"></i> Verified: ${verifiedReviewer.name}`;
    } catch (err) {
      console.error("Verification error:", err);
      alert("Error verifying booking code. Please try again.");
    }
  });
}

if (submissionForm) {
  submissionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!verifiedReviewer) return;

    const rating = document.querySelector('#review-submission-form input[name="rating"]:checked')?.value;
    const text = document.getElementById('review-text-input').value.trim();
    const imageFile = document.getElementById('review-image-input').files[0];

    const submitBtn = submissionForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      let imageUrl = null;
      if (imageFile) {
        const storageRef = firebase.storage().ref(`reviews/${Date.now()}_${imageFile.name}`);
        await storageRef.put(imageFile);
        imageUrl = await storageRef.getDownloadURL();
      }

      await db.collection('reviews').add({
        name: verifiedReviewer.name,
        email: verifiedReviewer.email,
        bookingCode: verifiedReviewer.code,
        rating: parseInt(rating),
        review: text,
        imageUrl: imageUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        approved: false
      });

      alert("Review submitted for moderation! Thank you.");
      submissionForm.reset();
      submissionForm.style.display = 'none';
      validationForm.style.display = 'block';
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Review";
    }
  });
}

function initFormHandlers() {
  loadReviews();
  
  // Setup footer admin link
  document.querySelectorAll('a').forEach(link => {
      if (link.href.includes('dashboard.html') || link.textContent.toLowerCase().includes('admin dashboard')) {
          link.onclick = (e) => {
              e.preventDefault();
              openAdminModal();
          };
      }
  });

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(bookingForm);
      const bookingData = Object.fromEntries(formData.entries());

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkinDate = new Date(bookingData.checkin);
      const checkoutDate = new Date(bookingData.checkout);

      if (!bookingData.name || !bookingData.guests || !bookingData.checkin || 
          !bookingData.checkout || !bookingData.phone || !bookingData.email) {
        showCustomAlert("Please fill all required booking fields.", "error");
        return;
      }

      if (checkinDate < today) {
        showCustomAlert("Check-in date cannot be in the past.", "error");
        return;
      }

      if (checkoutDate <= checkinDate) {
        showCustomAlert("Check-out date must be after check-in date.", "error");
        return;
      }

      // Show confirmation step instead of immediate submission
      openBookingConfirmation();
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        alert("Please fill all required fields.");
        return;
      }

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      db.collection("messages").add({
        name: name,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'new'
      }).then(() => {
        showCustomAlert("Thank you for your message!", "success");
        contactForm.reset();
      }).catch((error) => {
        console.error("Error sending message: ", error);
        showCustomAlert("Error sending message.", "error");
      }).finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    });
  }
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href').length > 1) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }
    });
  });
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.accommodation-card, .feature-card, .testimonial-card, .quick-link-card').forEach(el => {
    observer.observe(el);
  });
}

function initModalHandlers() {
  const modal = document.getElementById('booking-modal-bg');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }
}

function initNavbarScroll() {
  const navbar = document.querySelector('.main-header');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      }
    });
  }
}

let slideIndex = 0;
function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  if (!slides.length) return;
  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));
  slides[index].classList.add('active');
  indicators[index].classList.add('active');
}

function nextSlide() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) setInterval(nextSlide, 5000);
}

function openAdminModal() {
  if (localStorage.getItem('admin_logged_in') === 'true') {
    window.open('backend/dashboard.html', '_blank');
    return;
  }
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.style.display = 'flex';
}

function closeAdminModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('admin-login-error').style.display = 'none';
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;
  const errorDiv = document.getElementById('admin-login-error');
  if (username === 'gonahhomes0@gmail.com' && password === 'gonahhomes@0799466723') {
    localStorage.setItem('admin_logged_in', 'true');
    closeAdminModal();
    window.open('backend/dashboard.html', '_blank');
  } else {
    errorDiv.textContent = 'Invalid credentials.';
    errorDiv.style.display = 'block';
  }
}

function initAdminAccess() {
  const adminBtn = document.getElementById('admin-access-btn');
  if (adminBtn) adminBtn.onclick = (e) => { e.preventDefault(); openAdminModal(); };
  const adminForm = document.getElementById('admin-login-form');
  if (adminForm) adminForm.addEventListener('submit', handleAdminLogin);
}

function showCustomAlert(message, type = "success") {
  const alertBox = document.createElement('div');
  alertBox.classList.add('custom-alert', type);
  alertBox.innerHTML = `<p>${message}</p><span>&times;</span>`;
  document.body.appendChild(alertBox);
  alertBox.querySelector('span').onclick = () => alertBox.remove();
  setTimeout(() => alertBox.remove(), 5000);
}

window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.scrollToSection = scrollToSection;
window.currentSlide = (i) => { slideIndex = i-1; showSlide(slideIndex); };

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFormHandlers();
  initSmoothScrolling();
  initAnimations();
  initModalHandlers();
  initNavbarScroll();
  initSlideshow();
  initAdminAccess();
  console.log('Gonah Homes initialized!');
});

