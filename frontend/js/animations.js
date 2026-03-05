// ===== ADVANCED ANIMATIONS =====

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHoverAnimations();
    initTextAnimations();
    initWebBackground();
    initMagneticButtons();
    initParallaxCards();
    initGlitchEffect();
    initSpiderWebAnimation();
    initCounterRotate();
    initStaggerChildren();
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-scroll]');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.scroll || 'fadeInUp';
                const duration = element.dataset.duration || '1s';
                const delay = element.dataset.delay || '0s';
                
                element.style.animation = `${animation} ${duration} ease ${delay} forwards`;
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
}

// ===== HOVER ANIMATIONS =====
function initHoverAnimations() {
    // 3D Tilt Effect
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Shine Effect
    const shineElements = document.querySelectorAll('[data-shine]');
    
    shineElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            
            el.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,43,43,0.2), transparent 50%)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.background = '';
        });
    });

    // Border Animation
    const borderElements = document.querySelectorAll('[data-border-animate]');
    
    borderElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'rotate 4s linear infinite';
        });

        el.addEventListener('mouseleave', () => {
            el.style.animation = '';
        });
    });
}

// ===== TEXT ANIMATIONS =====
function initTextAnimations() {
    // Split text animation
    const splitTextElements = document.querySelectorAll('[data-split]');
    
    splitTextElements.forEach(el => {
        const text = el.textContent;
        const chars = text.split('');
        
        el.innerHTML = '';
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.05}s`;
            span.classList.add('char-animate');
            el.appendChild(span);
        });
    });

    // Gradient text animation
    const gradientTexts = document.querySelectorAll('[data-gradient]');
    
    gradientTexts.forEach(el => {
        el.classList.add('gradient-shift');
    });

    // Typewriter effect for multiple elements
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(el => {
        const text = el.textContent;
        const speed = parseInt(el.dataset.speed) || 100;
        
        el.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(el);
                }
            });
        });
        
        observer.observe(el);
    });
}

// ===== SPIDER WEB BACKGROUND =====
function initWebBackground() {
    const canvas = document.getElementById('spider-web');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let points = [];
    const numPoints = 30;
    const maxDistance = 150;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initPoints();
    }

    function initPoints() {
        points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function drawWeb() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        ctx.strokeStyle = '#ff2b2b';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.strokeStyle = `rgba(255, 43, 43, ${opacity * 0.2})`;
                    ctx.stroke();
                }
            }
        }
        
        // Draw points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ff2b2b';
            ctx.fill();
            
            // Update position
            point.x += point.vx;
            point.y += point.vy;
            
            // Bounce off edges
            if (point.x < 0 || point.x > width) point.vx *= -1;
            if (point.y < 0 || point.y > height) point.vy *= -1;
        });
        
        requestAnimationFrame(drawWeb);
    }

    window.addEventListener('resize', resize);
    resize();
    drawWeb();
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = parseInt(btn.dataset.magnetic) || 30;
            
            btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== PARALLAX CARDS =====
function initParallaxCards() {
    const cards = document.querySelectorAll('[data-parallax]');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        cards.forEach(card => {
            const speed = parseFloat(card.dataset.parallax) || 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===== GLITCH EFFECT =====
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('[data-glitch]');
    
    glitchElements.forEach(el => {
        const text = el.textContent;
        
        el.addEventListener('mouseenter', () => {
            el.classList.add('glitch');
            el.setAttribute('data-text', text);
        });

        el.addEventListener('mouseleave', () => {
            el.classList.remove('glitch');
        });
    });
}

// ===== SPIDER WEB ANIMATION (Canvas based) =====
function initSpiderWebAnimation() {
    const canvas = document.createElement('canvas');
    canvas.id = 'web-animation';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let spider = { x: 0, y: 0, angle: 0 };
    let webLines = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initWeb();
    }

    function initWeb() {
        webLines = [];
        const numLines = 8;
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * Math.PI * 2;
            webLines.push({
                startX: centerX,
                startY: centerY,
                endX: centerX + Math.cos(angle) * Math.max(width, height),
                endY: centerY + Math.sin(angle) * Math.max(width, height)
            });
        }
    }

    function drawSpider() {
        ctx.save();
        ctx.translate(spider.x, spider.y);
        ctx.rotate(spider.angle);
        
        // Draw spider body
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ff2b2b';
        ctx.fill();
        
        // Draw spider legs
        ctx.strokeStyle = '#ff2b2b';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 4; i++) {
            const angleOffset = (i - 2) * 0.3;
            
            // Left legs
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(-15, -10 + angleOffset * 10);
            ctx.stroke();
            
            // Right legs
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(15, -10 + angleOffset * 10);
            ctx.stroke();
        }
        
        // Draw spider eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-3, -8, 2, 0, Math.PI * 2);
        ctx.arc(3, -8, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-3.5, -8.5, 1, 0, Math.PI * 2);
        ctx.arc(2.5, -8.5, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    function animateSpider() {
        const time = Date.now() / 1000;
        
        // Move spider in a web-swinging pattern
        spider.x = width / 2 + Math.sin(time * 0.5) * 100;
        spider.y = height / 2 + Math.cos(time * 0.3) * 50;
        spider.angle = Math.sin(time) * 0.2;
        
        drawSpider();
        requestAnimationFrame(animateSpider);
    }

    window.addEventListener('resize', resize);
    resize();
    animateSpider();
}

// ===== COUNTER ROTATE =====
function initCounterRotate() {
    const rotateElements = document.querySelectorAll('[data-counter-rotate]');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        rotateElements.forEach(el => {
            const speed = parseFloat(el.dataset.counterRotate) || 10;
            const rotateX = (mouseY - 0.5) * speed;
            const rotateY = (mouseX - 0.5) * speed;
            
            el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// ===== STAGGER CHILDREN ANIMATION =====
function initStaggerChildren() {
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const children = container.children;
                const delay = parseFloat(container.dataset.stagger) || 0.1;
                
                Array.from(children).forEach((child, index) => {
                    child.style.animation = `fadeInUp 0.5s ease ${index * delay}s forwards`;
                });
                
                observer.unobserve(container);
            }
        });
    }, observerOptions);

    staggerContainers.forEach(container => observer.observe(container));
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .char-animate {
        display: inline-block;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.5s ease forwards;
    }
    
    [data-scroll] {
        opacity: 0;
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(animationStyles);