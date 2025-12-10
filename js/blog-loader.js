// Blog Loader - Dynamically loads blog posts from JSON data

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
});

async function loadBlogPosts() {
    try {
        const response = await fetch('data/blog-posts.json');
        const posts = await response.json();
        
        // Check which page we're on
        const isBlogPage = document.getElementById('all-blog-posts') !== null;
        const isHomePage = document.getElementById('latest-blog-posts') !== null;
        
        if (isBlogPage) {
            displayAllBlogPosts(posts);
        } else if (isHomePage) {
            displayLatestBlogPosts(posts);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        displayErrorMessage();
    }
}

function displayLatestBlogPosts(posts) {
    const container = document.getElementById('latest-blog-posts');
    if (!container) return;
    
    // Sort by date and get the latest 3 posts
    const latestPosts = posts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    container.innerHTML = latestPosts.map(post => createBlogCard(post)).join('');
    
    // Add animation
    animateBlogCards();
}

function displayAllBlogPosts(posts) {
    const container = document.getElementById('all-blog-posts');
    if (!container) return;
    
    // Sort by date (newest first)
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedPosts.map(post => createBlogCard(post)).join('');
    
    // Add animation
    animateBlogCards();
}

function createBlogCard(post) {
    const formattedDate = formatDate(post.date);
    const readTime = calculateReadTime(post.content);
    
    return `
        <article class="blog-card">
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="blog-category">${post.category}</div>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">
                        <i class="fas fa-calendar"></i>
                        ${formattedDate}
                    </span>
                    <span class="blog-read-time">
                        <i class="fas fa-clock"></i>
                        ${readTime} min read
                    </span>
                </div>
                <h3 class="blog-title">
                    <a href="blog/${post.slug}.html">${post.title}</a>
                </h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-footer">
                    <div class="blog-author">
                        <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                        <span class="author-name">${post.author.name}</span>
                    </div>
                    <a href="blog/${post.slug}.html" class="blog-read-more">
                        Read More
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
                ${post.tags ? `
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </article>
    `;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

function calculateReadTime(content) {
    // Average reading speed: 200 words per minute
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
}

function animateBlogCards() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

function displayErrorMessage() {
    const containers = [
        document.getElementById('latest-blog-posts'),
        document.getElementById('all-blog-posts')
    ];
    
    containers.forEach(container => {
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Sorry, we couldn't load the blog posts at this time. Please try again later.</p>
                </div>
            `;
        }
    });
}

// Search and filter functionality for blog page
if (document.getElementById('all-blog-posts')) {
    setupBlogFilters();
}

function setupBlogFilters() {
    const searchInput = document.getElementById('blog-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterBlogPosts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterBlogPosts);
    }
}

async function filterBlogPosts() {
    const searchTerm = document.getElementById('blog-search')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('category-filter')?.value || 'all';
    
    try {
        const response = await fetch('data/blog-posts.json');
        const posts = await response.json();
        
        let filteredPosts = posts;
        
        // Filter by search term
        if (searchTerm) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.excerpt.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => 
                post.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        
        // Display filtered posts
        const container = document.getElementById('all-blog-posts');
        if (container) {
            if (filteredPosts.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No blog posts found matching your criteria.</p>
                    </div>
                `;
            } else {
                const sortedPosts = filteredPosts.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                container.innerHTML = sortedPosts.map(post => createBlogCard(post)).join('');
                animateBlogCards();
            }
        }
    } catch (error) {
        console.error('Error filtering blog posts:', error);
    }
}
