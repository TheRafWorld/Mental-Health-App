import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase.js';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  arrayUnion, 
  arrayRemove, // Added for Unlike functionality
  increment 
} from 'firebase/firestore';
import CommunityPost from '../components/CommunityPost.jsx';
import '../styles/community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [replyText, setReplyText] = useState("");

  const categories = ["Daily Wins", "Resource Sharing", "Safe Venting", "Ask the Community", "Mindfulness"];

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please login to post!");

    try {
      await addDoc(collection(db, "posts"), {
        title,
        preview: content,
        category,
        user: auth.currentUser.displayName || "Anonymous User",
        userId: auth.currentUser.uid,
        likes: 0,
        likedBy: [], 
        replies: [],
        createdAt: serverTimestamp()
      });
      setShowCreateModal(false);
      setTitle(""); setContent(""); setCategory("");
    } catch (err) {
      console.error("Error adding post: ", err);
    }
  };

  // Updated Handle Like/Unlike Logic
  const handleLike = async (postId) => {
    if (!auth.currentUser) return alert("Login to like!");
    
    const userId = auth.currentUser.uid;
    const post = posts.find(p => p.id === postId);
    const postRef = doc(db, "posts", postId);
    
    const isLiked = post.likedBy?.includes(userId);

    try {
      if (isLiked) {
        // Unlike Logic
        await updateDoc(postRef, { 
          likes: increment(-1),
          likedBy: arrayRemove(userId) 
        });
      } else {
        // Like Logic
        await updateDoc(postRef, { 
          likes: increment(1),
          likedBy: arrayUnion(userId) 
        });
      }
    } catch (err) { console.error("Like toggle failed:", err); }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !auth.currentUser) return;

    const postRef = doc(db, "posts", selectedPost.id);
    const newReply = {
      text: replyText,
      user: auth.currentUser.displayName || "Anonymous",
      createdAt: new Date().toISOString()
    };

    try {
      await updateDoc(postRef, {
        replies: arrayUnion(newReply)
      });
      setReplyText("");
      setSelectedPost(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply]
      }));
    } catch (err) {
      console.error("Error adding reply: ", err);
    }
  };

  const filteredPosts = activeCategory === "All Topics" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="community-container">
      <header className="community-header">
        <div className="header-text">
          <h1>Community Forum</h1>
          <p>A safe space to share and connect.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          + Start a Discussion
        </button>
      </header>

      <div className="community-layout">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            <li 
              className={activeCategory === "All Topics" ? "active" : ""} 
              onClick={() => setActiveCategory("All Topics")}
            >All Topics</li>
            {categories.map(cat => (
              <li 
                key={cat} 
                className={activeCategory === cat ? "active" : ""} 
                onClick={() => setActiveCategory(cat)}
              >{cat}</li>
            ))}
          </ul>
        </aside>

        <main className="community-feed">
          {filteredPosts.map(post => (
            <CommunityPost 
              key={post.id} 
              post={post} 
              onLike={handleLike} 
              onOpen={setSelectedPost} 
              currentUserId={auth.currentUser?.uid}
            />
          ))}
        </main>
      </div>

      {/* MODAL 1: CREATE POST */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content create-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Discussion</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select a category...</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Headline..." />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="5" placeholder="Your story..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Post Discussion</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW POST DETAIL */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPost(null)}>&times;</button>
            
            <div className="detail-meta">
              <span className="post-category-tag">{selectedPost.category}</span>
              <span className="detail-author">Posted by <strong>{selectedPost.user}</strong></span>
            </div>

            <h2 className="detail-title">{selectedPost.title}</h2>
            <p className="detail-content">{selectedPost.preview}</p>
            
            <div className="detail-actions">
              <button 
                className={`like-btn modal-like ${posts.find(p => p.id === selectedPost.id)?.likedBy?.includes(auth.currentUser?.uid) ? 'active-liked' : ''}`} 
                onClick={() => handleLike(selectedPost.id)}
              >
                {posts.find(p => p.id === selectedPost.id)?.likedBy?.includes(auth.currentUser?.uid) ? '❤️ Liked' : '🤍 Like'} 
                ({posts.find(p => p.id === selectedPost.id)?.likes || 0})
              </button>
            </div>

            <div className="reply-section">
              <h3>Comments ({selectedPost.replies?.length || 0})</h3>
              <div className="reply-list">
                {selectedPost.replies && selectedPost.replies.length > 0 ? (
                  selectedPost.replies.map((r, i) => (
                    <div key={i} className="reply-card">
                      <strong>{r.user}</strong>
                      <p>{r.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-replies">No comments yet. Be the first to reply!</p>
                )}
              </div>
              <form onSubmit={handleReply} className="inline-reply-form">
                <input 
                  placeholder="Add a reply..." 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
                <button type="submit" className="btn-submit">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;