// ============================================
// BLOG LOADER - Load from JSON
// ============================================

class BlogLoader {
    constructor() {
        this.posts = [];
        this.categories = [];
        this.latestContainer = document.getElementById('latest-blog-posts');
        this.allPostsContainer = document.getElementById('all-blog-posts');
        this.categoriesContainer = document.getElementById('blog-categories');
        this.init();
    }

    async init() {
        await this.loadBlogData();
        if (this.latestContainer) {
            this.renderLatestPosts();
        }
        if (this.allPostsContainer) {
            this.renderAllPosts();
        }
        if (this.categoriesContainer) {
            this.renderCategories();
        }
    }

    async loadBlogData() {
        try {
            const response = await fetch('data/blog-posts.json');
            const data = await response.json();
            this.posts = data.posts;
            this.categories = data.categories;
        } catch (error) {
            console.error('Error loading blog data:', error);
            this.posts = [];
            this.categories = [];
        }
    }

    renderLatestPosts() {
        const latestPosts = this.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        if (latestPosts.length === 0) {
            this.latestContainer.innerHTML = '<p>No blog posts available.</p>';
            return;
        }

        this.latestContainer.innerHTML = latestPosts.map(post => this.createBlogCard(post)).join('');
        this.addBlogAnimations();
    }

    renderAllPosts(filter = null, searchQuery = '') {
        let filteredPosts = this.posts;
        
        // Filter by category
        if (filter && filter !== 'all') {
            filteredPosts = filteredPosts.filter(post => 
                post.category === filter || post.subcategory === filter
            );
        }
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredPosts = filteredPosts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        // Sort by date (newest first)
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filteredPosts.length === 0) {
            this.allPostsContainer.innerHTML = '<p class="no-posts">No posts found matching your criteria.</p>';
            return;
        }

        this.allPostsContainer.innerHTML = filteredPosts.map(post => this.createBlogCard(post)).join('');
        this.addBlogAnimations();
    }

    createBlogCard(post) {
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });

        return `
            <article class="blog-card">
                <div class="blog-image">
                    <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
                    ${post.featured ? '<div class="blog-badge">Featured</div>' : ''}
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span>
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </span>
                        <span>
                            <i class="fas fa-clock"></i>
                            ${post.readTime} min read
                        </span>
                        <span>
                            <i class="fas fa-folder"></i>
                            ${post.category}
                        </span>
                    </div>
                    <h3 class="blog-title">
                        <a href="blog-post.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-footer">
                        <a href="blog-post.html?id=${post.id}" class="read-more">
                            Read More
                            <i class="fas fa-arrow-right"></i>
                        </a>
                        <div class="blog-stats">
                            <span>
                                <i class="fas fa-eye"></i>
                                ${this.formatNumber(post.views)}
                            </span>
                            <span>
                                <i class="fas fa-heart"></i>
                                ${this.formatNumber(post.likes)}
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    renderCategories() {
        if (!this.categoriesContainer) return;
        
        const categoryHTML = `
            <div class="category-filters">
                <button class="category-btn active" data-category="all">
                    All Posts
                </button>
                ${this.categories.map(category => `
                    <button class="category-btn" data-category="${category.name}">
                        ${category.name}
                    </button>
                `).join('')}
            </div>
        `;
        
        this.categoriesContainer.innerHTML = categoryHTML;
        this.initCategoryFilters();
    }

    initCategoryFilters() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Filter posts
                const category = btn.dataset.category;
                this.renderAllPosts(category === 'all' ? null : category);
            });
        });
    }

    initSearchFunctionality() {
        const searchInput = document.getElementById('blog-search');
        if (!searchInput) return;
        
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.renderAllPosts(null, e.target.value);
            }, 300);
        });
    }

    addBlogAnimations() {
        const blogCards = document.querySelectorAll('.blog-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        blogCards.forEach(card => {
            observer.observe(card);
        });
    }

    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }

    getRelatedPosts(currentPostId, category, limit = 3) {
        return this.posts
            .filter(post => post.id !== currentPostId && post.category === category)
            .slice(0, limit);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    }
}

// Initialize blog loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogLoader = new BlogLoader();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogLoader;
          }
