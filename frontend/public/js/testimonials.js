// ===== TESTIMONIALS DATA MANAGEMENT =====

// Testimonials data (can be fetched from backend or defined here)
const testimonialsData = [
    {
        clientName: 'Sarah Johnson',
        clientPosition: 'CEO',
        clientCompany: 'TechStart Inc.',
        content: 'Solomon delivered a modern and high-quality website that exceeded our expectations. Professional and creative throughout the process.',
        rating: 5,
        projectType: 'Web Development',
        featured: true
    },
    {
        clientName: 'Michael Chen',
        clientPosition: 'Product Manager',
        clientCompany: 'InnovateLabs',
        content: 'Working with Solomon was a game-changer for our project. His technical expertise and creative problem-solving skills are outstanding.',
        rating: 5,
        projectType: 'Full Stack Application',
        featured: true
    },
    {
        clientName: 'Priya Patel',
        clientPosition: 'Founder',
        clientCompany: 'DesignStudio',
        content: 'The attention to detail and user experience in the design was phenomenal. Highly recommended for any creative project.',
        rating: 5,
        projectType: 'UI/UX Design',
        featured: true
    }
];

// Initialize testimonials slider
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.testimonials-slider')) {
        initTestimonialsSlider();
    }
});

// ===== INITIALIZE TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
    // Render testimonials
    renderTestimonials();
    
    // Initialize Swiper if available
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
}

// ===== RENDER TESTIMONIALS =====
function renderTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    container.innerHTML = testimonialsData.map(testimonial => `
        <div class="swiper-slide">
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"${testimonial.content}"</p>
                </div>
                <div class="testimonial-rating">
                    ${generateStars(testimonial.rating)}
                </div>
                <div class="testimonial-author">
                    <div class="author-image">
                        ${testimonial.clientName.charAt(0)}
                    </div>
                    <div class="author-info">
                        <h4>${testimonial.clientName}</h4>
                        <p>${testimonial.clientPosition}, ${testimonial.clientCompany}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== GENERATE STAR RATING =====
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}