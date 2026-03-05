// ===== CLEAN CONTACT FORM HANDLING =====
// No popups, no intrusive messages - just clean visual feedback

// API Configuration
const CONTACT_API_URL = 'https://portfolio-wcs5.onrender.com/api/contact';

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCleanContactForm();
    initFormAnimations();
    initCharacterCounter();
    initRecaptcha(); // If using reCAPTCHA
});

// ===== MAIN CONTACT FORM INITIALIZATION =====
function initCleanContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Prevent browser's default validation popups
    form.setAttribute('novalidate', 'true');

    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');

    // Prevent browser validation popups on invalid
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
        });
    });

    // Real-time validation events
    inputs.forEach(input => {
        // Validate on input (typing)
        input.addEventListener('input', () => {
            validateField(input);
        });

        // Validate on blur (leaving the field)
        input.addEventListener('blur', () => {
            validateField(input);
        });

        // Special handling for select dropdowns
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                validateField(input);
            });
        }
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            await submitForm(form);
        } else {
            // Scroll to first error smoothly
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
            
            // Show subtle notification
            showCleanNotification('Please check the highlighted fields', 'error');
        }
    });
}

// ===== CLEAN FIELD VALIDATION =====
// Returns true if valid, false if invalid
function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    // Remove existing validation classes
    formGroup.classList.remove('error', 'valid');
    
    // Skip validation for optional empty fields
    if (!field.required && !field.value) {
        return true;
    }

    let isValid = true;

    // Validation rules based on field type
    if (field.required && !value) {
        isValid = false; // Required field is empty
    } 
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } 
    else if (field.type === 'tel' && value) {
        // FIXED: Simplified phone regex that works in all browsers
        const phoneRegex = /^[0-9+\-\s\(\)]{10,20}$/;
        isValid = phoneRegex.test(value);
    } 
    else if (field.tagName === 'SELECT' && field.required) {
        isValid = value !== '';
    }

    // Apply visual classes
    if (isValid) {
        if (field.required || value) {
            formGroup.classList.add('valid');
        }
    } else {
        formGroup.classList.add('error');
    }

    return isValid;
}

// ===== FORM SUBMISSION =====
async function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add budget if it exists (from radio buttons)
    const budgetOption = form.querySelector('input[name="budget"]:checked');
    if (budgetOption) {
        data.budget = budgetOption.value;
    }

    try {
        // Make actual API call to your backend
        const response = await fetch(CONTACT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || 'Failed to send message');
        }
        
        // Success
        showCleanNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Remove validation classes
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('valid', 'error');
        });
        
        // Reset floating labels
        form.querySelectorAll('input, textarea, select').forEach(input => {
            const label = input.closest('.form-group')?.querySelector('label');
            if (label) {
                label.classList.remove('float');
            }
        });
        
        // Log success for debugging
        console.log('Form submitted successfully:', result);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showCleanNotification(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ===== CLEAN NOTIFICATION SYSTEM =====
// Subtle notifications that don't interrupt user experience
function showCleanNotification(message, type = 'success') {
    // Remove any existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Show with slight delay for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto-hide after 5 seconds (increased from 3)
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// ===== FORM ANIMATIONS =====
// Handles floating labels and ripple effects
function initFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        
        if (!input || !label) return;

        // Check initial state (for pre-filled fields)
        if (input.value || (input.type === 'select-one' && input.value)) {
            label.classList.add('float');
        }

        // Handle focus
        input.addEventListener('focus', () => {
            label.classList.add('float');
        });

        // Handle blur
        input.addEventListener('blur', () => {
            if (!input.value && (input.type !== 'select-one' || !input.value)) {
                label.classList.remove('float');
            }
        });

        // Handle select changes
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                if (input.value) {
                    label.classList.add('float');
                } else {
                    label.classList.remove('float');
                }
            });
        }
    });

    // Ripple effect on input click
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    inputs.forEach(input => {
        input.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'input-ripple';
            
            const rect = input.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            input.parentElement.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== CHARACTER COUNTER =====
// Shows remaining characters without being intrusive
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const counter = document.querySelector('.char-counter');
    if (!counter) return;
    
    const maxLength = messageField.getAttribute('maxlength') || 1000;
    
    // Update counter on input
    messageField.addEventListener('input', () => {
        const length = messageField.value.length;
        const remaining = maxLength - length;
        
        // Update counter text
        counter.textContent = `${length}/${maxLength}`;
        
        // Color coding based on remaining characters
        counter.classList.remove('warning', 'danger');
        
        if (remaining < 20) {
            counter.classList.add('danger');
        } else if (remaining < 100) {
            counter.classList.add('warning');
        }
    });
    
    // Initial count
    counter.textContent = `0/${maxLength}`;
}

// ===== DRAFT SAVE FEATURE =====
// Saves form data to localStorage
function saveFormDraft(formId = 'contact-form') {
    const form = document.getElementById(formId);
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    localStorage.setItem('contactFormDraft', JSON.stringify(data));
    showCleanNotification('Draft saved', 'success');
}

// Loads saved draft from localStorage
function loadFormDraft(formId = 'contact-form') {
    const draft = localStorage.getItem('contactFormDraft');
    if (!draft) return;

    const form = document.getElementById(formId);
    if (!form) return;

    const data = JSON.parse(draft);
    
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = data[key];
            // Trigger label float
            const label = input.closest('.form-group')?.querySelector('label');
            if (label && data[key]) {
                label.classList.add('float');
            }
        }
    });
    
    showCleanNotification('Draft loaded', 'success');
}

// Clears saved draft
function clearFormDraft() {
    localStorage.removeItem('contactFormDraft');
    showCleanNotification('Draft cleared', 'success');
}

// ===== RECAPTCHA PLACEHOLDER =====
function initRecaptcha() {
    // Add reCAPTCHA initialization here if needed
    console.log('reCAPTCHA ready');
}

// ===== AUTO-RESPONSE PLACEHOLDER =====
function sendAutoResponse(email, name) {
    // This would be handled by the backend
    console.log(`Auto-response would be sent to ${email}`);
}

// ===== ADDITIONAL STYLES FOR CLEAN VALIDATION =====
const cleanValidationStyles = document.createElement('style');
cleanValidationStyles.textContent = `
    /* Form Groups */
    .form-group {
        position: relative;
        margin-bottom: 1.8rem;
    }
    
    /* Input Fields */
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 1rem 1.2rem;
        background: rgba(255, 255, 255, 0.02);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: var(--font-primary);
    }
    
    /* Hover State */
    .form-group input:hover,
    .form-group select:hover,
    .form-group textarea:hover {
        border-color: rgba(255, 43, 43, 0.3);
    }
    
    /* Focus State */
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        border-color: var(--primary-red);
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 43, 43, 0.1);
        background: rgba(255, 43, 43, 0.02);
    }
    
    /* Labels */
    .form-group label {
        position: absolute;
        left: 1.2rem;
        top: 1rem;
        color: var(--text-muted);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        background: var(--bg-card);
        padding: 0 0.5rem;
        font-size: 0.95rem;
        z-index: 1;
    }
    
    /* Floating Label Effect */
    .form-group label.float,
    .form-group input:focus ~ label,
    .form-group textarea:focus ~ label,
    .form-group select:focus ~ label,
    .form-group input:not(:placeholder-shown) ~ label,
    .form-group textarea:not(:placeholder-shown) ~ label,
    .form-group select:not([value=""]):valid ~ label {
        top: -0.6rem;
        left: 0.8rem;
        font-size: 0.75rem;
        color: var(--primary-red);
        font-weight: 500;
    }
    
    /* Select Dropdown Styling */
    .form-group select {
        appearance: none;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ff2b2b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 16px;
        cursor: pointer;
        padding-right: 2.5rem;
    }
    
    .form-group select option {
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem;
    }
    
    /* ===== CLEAN VALIDATION INDICATORS ===== */
    
    /* Error State - Red border only */
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #f44336;
    }
    
    /* Success State - Green border */
    .form-group.valid input,
    .form-group.valid select,
    .form-group.valid textarea {
        border-color: #4CAF50;
    }
    
    /* Small error indicator dot */
    .error-indicator {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f44336;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .form-group.error .error-indicator {
        opacity: 1;
    }
    
    /* Success check indicator */
    .valid-indicator {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #4CAF50;
        font-size: 0.9rem;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .form-group.valid .valid-indicator {
        opacity: 1;
    }
    
    /* ===== BUDGET OPTIONS ===== */
    .budget-group {
        margin: 2rem 0;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
    }
    
    .budget-group label {
        display: block;
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-size: 0.95rem;
        font-weight: 500;
    }
    
    .budget-options {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .budget-option {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem 1.2rem;
        border-radius: 30px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }
    
    .budget-option:hover {
        background: rgba(255, 43, 43, 0.1);
        border-color: var(--primary-red);
    }
    
    .budget-option input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .budget-option span {
        color: var(--text-secondary);
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.3s ease;
    }
    
    .budget-option input[type="radio"]:checked + span,
    .budget-option input[type="radio"]:checked ~ span {
        color: var(--primary-red);
    }
    
    /* Selected state */
    .budget-option.selected {
        background: var(--primary-red);
        border-color: var(--primary-red);
    }
    
    .budget-option.selected span {
        color: var(--bg-primary);
    }
    
    /* ===== CHARACTER COUNTER ===== */
    .char-counter {
        position: absolute;
        right: 1rem;
        bottom: 0.5rem;
        font-size: 0.7rem;
        color: var(--text-muted);
        background: rgba(0, 0, 0, 0.3);
        padding: 0.2rem 0.5rem;
        border-radius: 20px;
        pointer-events: none;
        transition: all 0.3s ease;
    }
    
    .char-counter.warning {
        color: #ff9800;
    }
    
    .char-counter.danger {
        color: #f44336;
        font-weight: 600;
    }
    
    /* ===== NOTIFICATION SYSTEM ===== */
    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 1rem 1.5rem;
        background: var(--bg-card);
        border-left: 4px solid var(--primary-red);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        min-width: 300px;
        border: 1px solid var(--border-color);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left-color: #4CAF50;
    }
    
    .notification.error {
        border-left-color: #f44336;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification.success i {
        color: #4CAF50;
    }
    
    .notification.error i {
        color: #f44336;
    }
    
    /* ===== RIPPLE EFFECT ===== */
    .input-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 43, 43, 0.2);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* ===== FORM ROW LAYOUT ===== */
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.2rem;
        margin-bottom: 0.5rem;
    }
    
    /* ===== SUBMIT BUTTON ===== */
    .btn-block {
        width: 100%;
        padding: 1.2rem;
        font-size: 1.1rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-top: 1rem;
        background: var(--primary-red);
        color: var(--bg-primary);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .btn-block:hover {
        background: var(--primary-red-light);
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(255, 43, 43, 0.3);
    }
    
    .btn-block i {
        transition: transform 0.3s ease;
    }
    
    .btn-block:hover i {
        transform: translateX(5px);
    }
    
    .btn-block:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
    
    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .budget-options {
            flex-direction: column;
        }
        
        .budget-option {
            width: 100%;
        }
        
        .notification {
            min-width: auto;
            width: calc(100% - 40px);
            bottom: 20px;
            right: 20px;
            left: 20px;
        }
    }
`;

// Add the styles to the document
document.head.appendChild(cleanValidationStyles);