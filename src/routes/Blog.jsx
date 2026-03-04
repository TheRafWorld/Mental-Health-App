import React, { useState } from 'react';
import '../styles/blog.css';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ["All", "Mindfulness", "Daily Wins", "Resource Sharing", "Stories"];

  const posts = [
    {
      id: 1,
      category: "Mindfulness",
      title: "Understanding Mindfulness in a Digital Age",
      content: `Mindfulness isn't just about sitting in a quiet room; it's about how we interact with our screens. 
      
      In this article, we explore how to set boundaries with notifications and find 'micro-moments' of peace during a busy workday. By practicing intentional breathing for just 60 seconds between meetings, you can significantly lower your cortisol levels and improve your focus for the rest of the afternoon.
      
      The goal isn't to escape technology, but to use it with intention rather than reacting to every ping.`,
      excerpt: "How to find moments of stillness despite the constant noise of notifications...",
      author: "Admin",
      date: "Feb 5, 2026",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      category: "Daily Wins",
      title: "Small Steps: Why Consistency Beats Intensity",
      content: `We often think big changes require big actions. However, the '1% Rule' suggests that improving by just a tiny margin every day leads to exponential growth over time. 
      
      Whether it's drinking one extra glass of water or writing one sentence in a journal, these daily wins build the neural pathways required for long-term habit sustainability. Consistency is the foundation of mental health maintenance.`,
      excerpt: "The science behind habit formation and why your 'micro-wins' matter more than you think...",
      author: "Team",
      date: "Feb 1, 2026",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="page blog-page container-fluid">
      {/* HEADER SECTION */}
      <header className="blog-header text-center">
        <h1 className="fw-bold">Blog</h1>
        <p className="text-muted">Latest articles and updates from our experts.</p>
        
        <div className="blog-filters d-flex justify-content-center gap-2 mt-4">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* BLOG POSTS GRID */}
      <div className="blog-grid mt-5">
        {posts
          .filter(p => activeCategory === "All" || p.category === activeCategory)
          .map(post => (
            <article key={post.id} className="blog-post-card">
              <div className="blog-img-container">
                <img src={post.image} alt={post.title} />
                <span className="blog-category-badge">{post.category}</span>
              </div>
              <div className="blog-post-content">
                <div className="blog-meta">{post.date} • {post.author}</div>
                <h2 className="blog-post-title">{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <button 
                  className="read-more-link" 
                  onClick={() => setSelectedPost(post)}
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
      </div>

      {/* ARTICLE DETAIL MODAL */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content blog-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn-round" onClick={() => setSelectedPost(null)} aria-label="Close">
              &times;
            </button>
            
            <img src={selectedPost.image} alt={selectedPost.title} className="modal-hero-img" />
            
            <div className="modal-body-content">
              <span className="badge-category">{selectedPost.category}</span>
              <h2 className="detail-title-large">{selectedPost.title}</h2>
              <div className="detail-user-info">
                By <strong>{selectedPost.author}</strong> • {selectedPost.date}
              </div>
              <hr className="modal-divider" />
              <p className="blog-full-text">{selectedPost.content}</p>
            </div>
            
            <div className="modal-footer">
              <button className="btn-submit" onClick={() => setSelectedPost(null)}>
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;