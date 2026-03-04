import React from 'react';

const CommunityPost = ({ post, onLike, onOpen, currentUserId }) => {
  if (!post) return null;

  // Check if the current user has liked this post
  const isLiked = post.likedBy?.includes(currentUserId);

  return (
    <div className="forum-card" onClick={() => onOpen(post)}>
      <div className="forum-card-header">
        <span className="post-category">{post.category || "General"}</span>
        <span className="post-time">
          {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "Just now"}
        </span>
      </div>
      
      <h2 className="post-title">{post.title}</h2>
      <p className="post-preview">
        {post.preview?.length > 140 ? post.preview.substring(0, 140) + "..." : post.preview}
      </p>
      
      <div className="forum-card-footer">
        <span className="post-user">By <strong>{post.user}</strong></span>
        <div className="post-stats">
          <span className="stat-item">💬 {post.replies?.length || 0}</span>
          <button 
            className={`like-btn ${isLiked ? 'active-like' : ''}`} 
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
          >
            {isLiked ? '❤️' : '🤍'} {post.likes || 0}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;