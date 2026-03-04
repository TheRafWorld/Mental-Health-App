import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  updateProfile 
} from "firebase/auth";
import '../styles/account.css';

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const NAME_LIMIT = 20;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setNewName(currentUser.displayName || "");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        window.location.reload(); 
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) { setError(err.message); }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setMessage({ type: "success", text: "Display name updated!" });
    } catch (err) { setMessage({ type: "error", text: err.message }); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage({ type: "success", text: "Password updated!" });
      setNewPassword("");
    } catch (err) { setMessage({ type: "error", text: "Please re-login to change password." }); }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="account-page">
      <div className="account-container">
        {user ? (
          <div className="dashboard-card">
            <div className="dashboard-header">
              <h2>Account Settings</h2>
              <div className="user-badge">
                <span>Current User: </span>
                <strong>{user.displayName || user.email}</strong>
              </div>
            </div>

            {message.text && <div className={`status-msg ${message.type}`}>{message.text}</div>}

            <div className="settings-grid">
              <section className="settings-box">
                <h3>Update Display Name</h3>
                <form onSubmit={handleUpdateName}>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter new name"
                      maxLength={NAME_LIMIT}
                      required 
                    />
                    <span className="char-tag">{newName.length}/{NAME_LIMIT}</span>
                  </div>
                  <button type="submit" className="btn-secondary">Update Name</button>
                </form>
              </section>

              <section className="settings-box">
                <h3>Change Password</h3>
                <form onSubmit={handleUpdatePassword}>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required 
                  />
                  <button type="submit" className="btn-secondary">Update Password</button>
                </form>
              </section>
            </div>

            <button className="btn-logout" onClick={() => signOut(auth)}>Log Out</button>
          </div>
        ) : (
          <div className="auth-card">
            <div className="auth-header">
              <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
            </div>
            {error && <div className="status-msg error">{error}</div>}
            <form onSubmit={handleAuth} className="auth-form">
              {isRegistering && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      maxLength={NAME_LIMIT}
                      required 
                      placeholder="Your Name" 
                    />
                    <span className="char-tag">{name.length}/{NAME_LIMIT}</span>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary">
                {isRegistering ? "Sign Up" : "Login"}
              </button>
            </form>
            <button className="btn-link" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Already have an account? Login" : "New here? Create account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;