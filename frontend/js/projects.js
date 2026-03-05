// ===== PROJECTS DATA MANAGEMENT =====

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let allProjects = [];
let currentFilter = 'all';

// Initialize projects section
document.addEventListener('DOMContentLoaded', () => {
    initProjects();
    initProjectModal();
});

// ===== FETCH PROJECTS =====
async function fetchProjects() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        allProjects = data.data || data; // Handle both response formats
        
        hideLoading();
        renderProjects(allProjects);
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        hideLoading();
        showError('Failed to load projects. Please try again later.');
    }
}

// ===== RENDER PROJECTS =====
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open"></i>
                <h3>No Projects Yet</h3>
                <p>Check back soon for exciting projects!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map(project => createProjectCard(project)).join('');
    
    // Add click event listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking on links
            if (!e.target.closest('a')) {
                const projectId = card.dataset.id;
                openProjectModal(projectId);
            }
        });
    });
}

// ===== CREATE PROJECT CARD =====
function createProjectCard(project) {
    const category = project.category || 'web';
    const technologies = Array.isArray(project.technologies) 
        ? project.technologies.join(', ') 
        : project.tech || 'Various';
    
    return `
        <div class="project-card" data-id="${project._id || project.id}" data-category="${category}">
            <div class="project-image">
                <img src="${project.image || '/assets/images/project-placeholder.jpg'}" 
                     alt="${project.title}"
                     loading="lazy">
                <div class="project-overlay">
                    <span class="project-category">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${Array.isArray(project.technologies) 
                        ? project.technologies.slice(0, 3).map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                          ).join('')
                        : `<span class="tech-tag">${project.tech || technologies}</span>`
                    }
                    ${project.technologies?.length > 3 ? `<span class="tech-tag">+${project.technologies.length - 3}</span>` : ''}
                </div>
                <div class="project-links">
                    ${project.liveUrl || project.link ? `
                        <a href="${project.liveUrl || project.link}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                    ${project.githubUrl ? `
                        <a href="${project.githubUrl}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> Code
                        </a>
                    ` : ''}
                </div>
                ${project.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
            </div>
        </div>
    `;
}

// ===== PROJECT MODAL =====
function initProjectModal() {
    // Create modal element if it doesn't exist
    if (!document.getElementById('project-modal')) {
        const modal = document.createElement('div');
        modal.id = 'project-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal when clicking close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            closeProjectModal();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeProjectModal();
            }
        });
    }
}

async function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    try {
        modalBody.innerHTML = '<div class="modal-loading"><div class="spinner"></div><p>Loading project details...</p></div>';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Fetch project details
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project details');
        
        const data = await response.json();
        const project = data.data || data;
        
        modalBody.innerHTML = createProjectModalContent(project);
        
    } catch (error) {
        console.error('Error fetching project details:', error);
        modalBody.innerHTML = `
            <div class="modal-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load project details.</p>
                <button class="btn btn-primary" onclick="closeProjectModal()">Close</button>
            </div>
        `;
    }
}

function createProjectModalContent(project) {
    const technologies = Array.isArray(project.technologies) 
        ? project.technologies 
        : (project.tech ? project.tech.split(',').map(t => t.trim()) : []);
    
    return `
        <div class="modal-header">
            <h2>${project.title}</h2>
            ${project.featured ? '<span class="featured-badge large"><i class="fas fa-star"></i> Featured Project</span>' : ''}
        </div>
        
        <div class="modal-gallery">
            <img src="${project.image || '/assets/images/project-placeholder.jpg'}" alt="${project.title}" class="modal-main-image">
            ${project.images && project.images.length > 0 ? `
                <div class="modal-thumbnails">
                    ${project.images.map(img => `<img src="${img}" alt="Project thumbnail" onclick="changeMainImage(this.src)">`).join('')}
                </div>
            ` : ''}
        </div>
        
        <div class="modal-info">
            <div class="modal-description">
                <h3>Project Overview</h3>
                <p>${project.longDescription || project.description}</p>
            </div>
            
            <div class="modal-details">
                <div class="detail-section">
                    <h3>Technologies Used</h3>
                    <div class="tech-stack">
                        ${technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                    </div>
                </div>
                
                ${project.features && project.features.length > 0 ? `
                    <div class="detail-section">
                        <h3>Key Features</h3>
                        <ul class="features-list">
                            ${project.features.map(feature => `<li><i class="fas fa-check-circle"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="modal-actions">
            ${project.liveUrl || project.link ? `
                <a href="${project.liveUrl || project.link}" target="_blank" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            ` : ''}
            ${project.githubUrl ? `
                <a href="${project.githubUrl}" target="_blank" class="btn btn-outline">
                    <i class="fab fa-github"></i> View Code
                </a>
            ` : ''}
            ${project.videoUrl ? `
                <a href="${project.videoUrl}" target="_blank" class="btn btn-outline">
                    <i class="fas fa-video"></i> Watch Demo
                </a>
            ` : ''}
        </div>
    `;
}

function changeMainImage(src) {
    const mainImage = document.querySelector('.modal-main-image');
    if (mainImage) {
        mainImage.src = src;
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== FILTER PROJECTS =====
function filterProjects(category) {
    currentFilter = category;
    
    if (category === 'all') {
        renderProjects(allProjects);
    } else {
        const filtered = allProjects.filter(project => 
            project.category === category || 
            (category === 'featured' && project.featured)
        );
        renderProjects(filtered);
    }
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
}

// ===== SEARCH PROJECTS =====
function searchProjects(query) {
    if (!query.trim()) {
        filterProjects(currentFilter);
        return;
    }
    
    const searchTerm = query.toLowerCase();
    const filtered = allProjects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        (project.technologies && project.technologies.some(tech => 
            tech.toLowerCase().includes(searchTerm)
        ))
    );
    
    renderProjects(filtered);
}

// ===== SORT PROJECTS =====
function sortProjects(method) {
    let sorted = [...allProjects];
    
    switch(method) {
        case 'newest':
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'alphabetical':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'featured':
            sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }
    
    renderProjects(sorted);
}

// ===== LOADING STATES =====
function showLoading() {
    const container = document.getElementById('projects-container');
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading amazing projects...</p>
            </div>
        `;
    }
}

function hideLoading() {
    // Loading is removed when rendering projects
}

function showError(message) {
    const container = document.getElementById('projects-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="fetchProjects()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
}

// ===== INITIALIZATION =====
function initProjects() {
    // Fetch projects
    fetchProjects();
    
    // Initialize filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterProjects(btn.dataset.filter);
        });
    });
    
    // Initialize search (if search input exists)
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProjects(searchInput.value);
            }, 300);
        });
    }
    
    // Initialize sort (if sort select exists)
    const sortSelect = document.getElementById('project-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProjects(sortSelect.value);
        });
    }
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        overflow-y: auto;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal.show {
        display: block;
        opacity: 1;
    }
    
    .modal-content {
        position: relative;
        max-width: 1000px;
        margin: 50px auto;
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        padding: 2rem;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border-color);
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .modal.show .modal-content {
        transform: translateY(0);
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        font-size: 2rem;
        color: var(--text-muted);
        cursor: pointer;
        transition: color 0.3s ease;
        line-height: 1;
    }
    
    .modal-close:hover {
        color: var(--primary-red);
    }
    
    .modal-loading,
    .modal-error {
        text-align: center;
        padding: 3rem;
    }
    
    .modal-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--primary-red);
    }
    
    .modal-gallery {
        margin-bottom: 2rem;
    }
    
    .modal-main-image {
        width: 100%;
        max-height: 500px;
        object-fit: cover;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        border: 1px solid var(--border-color);
    }
    
    .modal-thumbnails {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }
    
    .modal-thumbnails img {
        width: 80px;
        height: 60px;
        object-fit: cover;
        border-radius: var(--radius-sm);
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        border: 2px solid transparent;
    }
    
    .modal-thumbnails img:hover {
        opacity: 1;
        border-color: var(--primary-red);
    }
    
    .modal-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .modal-description h3,
    .detail-section h3 {
        color: var(--primary-red);
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
    
    .modal-description p {
        color: var(--text-secondary);
        line-height: 1.8;
    }
    
    .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    
    .tech-item {
        background: rgba(255, 43, 43, 0.1);
        color: var(--primary-red);
        padding: 0.4rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.9rem;
        border: 1px solid rgba(255, 43, 43, 0.3);
    }
    
    .features-list {
        list-style: none;
    }
    
    .features-list li {
        color: var(--text-secondary);
        margin-bottom: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .features-list li i {
        color: var(--primary-red);
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .featured-badge.large {
        display: inline-block;
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }
    
    .no-projects {
        text-align: center;
        padding: 4rem;
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
    }
    
    .no-projects i {
        font-size: 4rem;
        color: var(--primary-red);
        margin-bottom: 1rem;
    }
    
    .no-projects h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .no-projects p {
        color: var(--text-muted);
    }
    
    .error-message {
        text-align: center;
        padding: 4rem;
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
    }
    
    .error-message i {
        font-size: 4rem;
        color: #f44336;
        margin-bottom: 1rem;
    }
    
    .error-message h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .error-message p {
        color: var(--text-muted);
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .modal-content {
            margin: 20px;
            padding: 1.5rem;
        }
        
        .modal-info {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        
        .modal-actions {
            flex-direction: column;
        }
        
        .modal-actions .btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(modalStyles);