// --- Dark Mode Switch ---
document.getElementById('darkModeToggle').onclick = function() {
  document.body.classList.toggle('dark');
  this.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
};

// --- Responsive Nav Toggle ---
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.onclick = function() {
  navMenu.classList.toggle('nav-open');
};
navMenu.querySelectorAll('a').forEach(link => {
  link.onclick = () => navMenu.classList.remove('nav-open');
});

// --- Projects Data ---
const projects = [
  {
    title: "Brand Website Launch",
    desc: "Designed and deployed a full-featured brand website for a local business, leveraging WordPress, custom graphics, and SEO best practices.",
    link: "https://example.com/project1"
  },
  {
    title: "AI-Powered Content Automation",
    desc: "Built an automation workflow using ChatGPT and Zapier to streamline blog and social content for creators.",
    link: "https://example.com/project2"
  },
  {
    title: "Social Media Growth Campaign",
    desc: "Developed and executed a digital marketing campaign that increased engagement and followers by 40% in three months.",
    link: "https://example.com/project3"
  },
  {
    title: "Visual Branding Packs",
    desc: "Created logo, reels, and brand kits for startups, focusing on clarity and creativity.",
    link: "https://example.com/project4"
  }
];

const projectsGrid = document.getElementById('projectsGrid');
projects.forEach(proj => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `<div class="project-title">${proj.title}</div>
    <p class="project-desc">${proj.desc}</p>
    <a class="project-link" href="${proj.link}" target="_blank">View Project</a>`;
  projectsGrid.appendChild(card);
});

// --- Blog Data (Only Owner Publishes) ---
const blogs = [
  {
    title: "How to Build a Personal Brand Online",
    category: "Digital Marketing",
    content: "Building a personal brand online involves clarity, consistency, and creative storytelling. Start by defining your unique value, create quality content, and engage with your audience across platforms.",
  },
  {
    title: "Top 5 AI Tools for Creators in 2025",
    category: "AI & Automation",
    content: "AI is revolutionizing digital creation. My top picks: ChatGPT for content, Canva AI for design, Zapier for automation, Grammarly for writing, and Notion AI for workflow efficiency.",
  },
  {
    title: "Design Principles for Engaging Websites",
    category: "Web Design",
    content: "Engaging websites combine visual clarity, responsive layouts, and strategic content. Always prioritize user experience and clear calls to action.",
  }
];

// Show featured blog (first one)
const blogFeatured = document.getElementById('blogFeatured');
if (blogs.length > 0) {
  const b = blogs[0];
  const feat = document.createElement('div');
  feat.className = 'blog-post';
  feat.innerHTML = `<div class="blog-title">${b.title}</div>
    <span class="blog-category">${b.category}</span>
    <div class="blog-content">${b.content.substring(0, 90)}... <span style="color:#FF9F40;font-weight:bold;cursor:pointer;" onclick="openBlogModal(0)">Read More</span></div>`;
  blogFeatured.appendChild(feat);
}

// Blog list (rest, click to open modal)
const blogList = document.getElementById('blogList');
blogs.slice(1).forEach((b, idx) => {
  const post = document.createElement('div');
  post.className = 'blog-post';
  post.innerHTML = `<div class="blog-title">${b.title}</div>
    <span class="blog-category">${b.category}</span>
    <div class="blog-content">${b.content.substring(0, 70)}... <span style="color:#FF9F40;font-weight:bold;cursor:pointer;" onclick="openBlogModal(${idx+1})">Read More</span></div>`;
  blogList.appendChild(post);
});

// Modal Blog View
window.openBlogModal = function(i) {
  const blog = blogs[i];
  document.getElementById('modalBlogTitle').textContent = blog.title;
  document.getElementById('modalBlogCategory').textContent = blog.category;
  document.getElementById('modalBlogContent').textContent = blog.content;
  document.getElementById('blogModal').style.display = 'flex';
};
document.getElementById('blogModalClose').onclick = function() {
  document.getElementById('blogModal').style.display = 'none';
};
window.onclick = function(event) {
  if(event.target == document.getElementById('blogModal')) {
    document.getElementById('blogModal').style.display = 'none';
  }
};

// --- Contact Form ---
document.getElementById('contactForm').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();
  const status = document.getElementById('contactMsg');
  if (!name || !email || !msg) {
    status.textContent = "Please fill out all fields.";
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    status.textContent = "Please use a valid email.";
    return;
  }
  status.textContent = "Thank you for your inquiry!";
  setTimeout(() => { status.textContent = ""; }, 4000);
  this.reset();
};