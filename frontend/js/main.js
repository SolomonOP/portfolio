// ===== MAIN INITIALIZATION FILE =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavigation();
    initBackToTop();
    initSmoothScroll();
    initAOS();
    initParticles();
    initTypedText();
    initCounterAnimation();
    initSkillBars();
    initFilterButtons();
    initThemeToggle();
    initScrollSpy();
    initParallax();
    initFormValidation();
    initTooltips();
});

// ===== LOADER =====
function initLoader() {
    const loader = document.querySelector('.loader-wrapper');
    if (!loader) return;

    // Hide loader after page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// ===== CUSTOM CURSOR =====
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Add slight delay to outline for smooth effect
            setTimeout(() => {
                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            }, 50);
        });

        // Hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .service-card, .feature-card');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('active');
                cursorOutline.classList.add('active');
            });

            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('active');
                cursorOutline.classList.remove('active');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });
    } else {
        // Hide custom cursor on touch devices
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== AOS INITIALIZATION =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out',
            delay: 100,
            disable: 'mobile'
        });
    }
}

// ===== PARTICLES.JS INITIALIZATION =====
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ff2b2b'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ff2b2b',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ===== TYPED TEXT ANIMATION =====
function initTypedText() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    if (!typedTextSpan || !cursorSpan) return;

    const words = ['Full Stack Developer', 'Web Designer', 'Creative Developer', 'Problem Solver', 'UI/UX Enthusiast'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        
        typedTextSpan.textContent = currentChar;
        
        if (!isDeleting && charIndex < currentWord.length) {
            // Typing forward
            charIndex++;
            setTimeout(typeEffect, 100);
        } else if (isDeleting && charIndex > 0) {
            // Deleting backward
            charIndex--;
            setTimeout(typeEffect, 50);
        } else {
            // Switch word
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(typeEffect, 1000);
        }
    }

    // Start typing effect
    setTimeout(typeEffect, 1000);
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-count') || target.textContent);
                let currentValue = 0;
                const increment = targetValue / 50; // Increment over 50 steps
                const duration = 2000; // 2 seconds
                const stepTime = duration / 50;

                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        target.textContent = targetValue;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.round(currentValue);
                    }
                }, stepTime);

                observer.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (!skillBars.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width') || '0';
                bar.style.width = width + '%';
                bar.classList.add('progress-animate');
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ===== FILTER BUTTONS =====
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    if (!filterBtns.length || !projects.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter projects
            projects.forEach(project => {
                if (filterValue === 'all' || project.dataset.category === filterValue) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== THEME TOGGLE (for future implementation) =====
function initThemeToggle() {
    // This can be expanded later for light/dark theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        // Save preference to localStorage
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// ===== SCROLL SPY =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
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
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            const speed = 0.5;
            const yPos = -(scrollPosition * speed);
            heroSection.style.backgroundPositionY = `${yPos}px`;
        }
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                input.classList.add('error');
            });

            input.addEventListener('input', () => {
                if (input.validity.valid) {
                    input.classList.remove('error');
                }
            });
        });
    });
}

// ===== TOOLTIPS =====
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(el => {
        let tooltip = null;

        el.addEventListener('mouseenter', (e) => {
            const text = el.getAttribute('data-tooltip');
            if (!text) return;

            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);

            const rect = el.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.classList.add('show');
        });

        el.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });
}

// Add tooltip styles dynamically
const tooltipStyles = document.createElement('style');
tooltipStyles.textContent = `
    .tooltip {
        position: fixed;
        background: var(--primary-red);
        color: var(--bg-primary);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-sm);
        font-size: 0.8rem;
        font-weight: 500;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s, transform 0.3s;
        white-space: nowrap;
        box-shadow: var(--shadow-md);
    }
    
    .tooltip.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid var(--primary-red);
    }
    
    .no-scroll {
        overflow: hidden;
    }
    
    input.error,
    textarea.error,
    select.error {
        border-color: #f44336 !important;
    }
`;
document.head.appendChild(tooltipStyles);