import React from 'react'
import '../styles/footer.css'

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Guiding Light Initiative. All rights reserved.</p>
    </footer>
  )
}

export default Footer