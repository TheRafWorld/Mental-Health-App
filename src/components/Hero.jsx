import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';


const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>When Your Lost Find Our Lighthouse</h1>
        <p>Breaking the stigma, building awareness, supporting each other</p>
        <div className="hero-buttons">
          <Link to="/appointments" className="btn btn-primary">Find Help Now</Link>
          {/* <Link to="/resources" className="btn btn-outline-light">Learn More</Link> */}
        </div>
      </div>
    </section>
  );
}

export default Hero;