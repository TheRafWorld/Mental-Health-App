import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from '../../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import '../styles/navbar.css'
import logo from '../assets/logo.png'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [user, setUser] = useState(null)

    // Listen for authentication state changes to update the name dynamically
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe() 
    }, [])

    const closeMenu = () => setMenuOpen(false)

    return (
        <nav className="app-navbar">
            <div className="app-navbar-scaler">
                <NavLink onClick={closeMenu} to="/" end className="app-navbar-brand">
                    <img src={logo} className="app-navbar-logo" alt="Logo" />
                    <h1>Guilding Light Initiative</h1>
                </NavLink>
                
                <button onClick={() => setMenuOpen(!menuOpen)} className="app-navbar-menu-icon">
                    <span>
                        {menuOpen ? '✕' : '☰'}
                    </span>
                </button>
            </div>

            <div className={menuOpen ? "app-navbar-menu open" : "app-navbar-menu"}>
                <NavLink to="/resources" onClick={closeMenu} className={({ isActive }) => `app-navbar-item ${isActive ? 'active' : ''}`}>
                    Resources
                </NavLink>
                <NavLink to="/appointments" onClick={closeMenu} className={({ isActive }) => `app-navbar-item ${isActive ? 'active' : ''}`}>
                    Appointments
                </NavLink>
                <NavLink to="/community" onClick={closeMenu} className={({ isActive }) => `app-navbar-item ${isActive ? 'active' : ''}`}>
                    Community
                </NavLink>
                <NavLink to="/blog" onClick={closeMenu} className={({ isActive }) => `app-navbar-item ${isActive ? 'active' : ''}`}>
                    Blog
                </NavLink>

                {/* --- DYNAMIC ACCOUNT BUTTON --- */}
                <NavLink 
                    to="/account" 
                    onClick={closeMenu} 
                    className={({ isActive }) => `app-navbar-item account-nav-btn ${isActive ? 'active' : ''}`}
                >
                    {user ? (
                        <span className="user-display-name">
                            {/* Fallback logic: Name > Email Prefix > "Profile" */}
                            {user.displayName || user.email.split('@')[0] || "Profile"}
                        </span>
                    ) : (
                        "Login"
                    )}
                </NavLink>
            </div>
        </nav>
    )
}

export default Navbar