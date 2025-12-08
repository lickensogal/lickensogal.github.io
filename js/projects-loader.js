// ============================================
// PROJECTS LOADER - Load from JSON
// ============================================

class ProjectsLoader {
    constructor() {
        this.projects = [];
        this.featuredContainer = document.getElementById('featured-projects');
        this.allProjectsContainer = document.getElementById('all-projects');
        this.init();
    }

    async init() {
        await this.loadProjects();
        if (this.featuredContainer) {
            this.renderFeaturedProjects();
        }
        if (this.allProjectsContainer) {
            this.renderAllProjects();
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            this.projects = data.projects;
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    renderFeaturedProjects() {
        const featuredProjects = this.projects.filter(p => p.featured).slice(0, 4);
        
        if (featuredProjects.length === 0) {
            this.featuredContainer.innerHTML = '<p>No featured projects available.</p>';
            return;
        }

        this.featuredContainer.innerHTML = featuredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <a href="project-details.html?id=${project.id}" class="project-view">
                            <i class="fas fa-eye"></i>
                        </a>
                        ${project.liveUrl ? `
                            <a href="${project.liveUrl}" class="project-live" target="_blank">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" class="project-github" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-category">${project.category}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.shortDescription}</p>
                    <div class="project-tags">
                        ${project.tags.slice(0, 3).map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        this.addProjectAnimations();
    }

    renderAllProjects(filter = 'all') {
        let filteredProjects = this.projects;
        
        if (filter !== 'all') {
            filteredProjects = this.projects.filter(p => p.category === filter);
        }

        if (filteredProjects.length === 0) {
            this.allProjectsContainer.innerHTML = '<p class="no-projects">No projects found in this category.</p>';
            return;
        }

        this.allProjectsContainer.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <a href="project-details.html?id=${project.id}" class="project-view">
                            <i class="fas fa-eye"></i>
                        </a>
                        ${project.liveUrl ? `
                            <a href="${project.liveUrl}" class="project-live" target="_blank">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" class="project-github" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-category">${project.category}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.shortDescription}</p>
                    <div class="project-tags">
                        ${project.tags.slice(0, 3).map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        this.addProjectAnimations();
    }

    addProjectAnimations() {
        const projectCards = document.querySelectorAll('.project-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach(card => {
            observer.observe(card);
        });
    }

    getRelatedProjects(currentProjectId, category, limit = 3) {
        return this.projects
            .filter(p => p.id !== currentProjectId && p.category === category)
            .slice(0, limit);
    }

    getProjectById(id) {
        return this.projects.find(p => p.id === id);
    }
}

// Initialize projects loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsLoader = new ProjectsLoader();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsLoader;
                          }
