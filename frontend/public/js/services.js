// ===== SERVICES DATA MANAGEMENT =====

// Services data (can be fetched from backend or defined here)
const servicesData = [
    {
        title: 'Creative Website Design',
        description: 'Modern, responsive, and visually appealing websites tailored to your brand identity.',
        icon: '🎨',
        features: [
            'Custom design tailored to your brand',
            'Mobile-first responsive layout',
            'SEO optimized structure',
            'Fast loading performance'
        ]
    },
    {
        title: 'Full Stack Web Development',
        description: 'Complete web applications with frontend, backend, and database integration.',
        icon: '⚡',
        features: [
            'MERN stack expertise',
            'RESTful API development',
            'Database design & optimization',
            'Secure authentication systems'
        ]
    },
    {
        title: 'UI/UX Design',
        description: 'Clean layouts, intuitive user experiences, and smooth interactions.',
        icon: '🎯',
        features: [
            'User-centered design approach',
            'Wireframing & prototyping',
            'Interactive animations',
            'Usability testing'
        ]
    }
];

// Initialize services section
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    initServiceHover();
});

// ===== RENDER SERVICES =====
function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) return;

    container.innerHTML = servicesData.map(service => `
        <div class="service-card" data-aos="fade-up">
            <div class="service-icon">
                ${service.icon}
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <ul class="service-features">
                ${service.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// ===== SERVICE HOVER EFFECTS =====
function initServiceHover() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}