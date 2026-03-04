import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/services.css'
import { service1img, service2img, service3img } from '../assets/assets.js'

const Services = () => {
  return (
    <section className="services">
        <h2>Our Services</h2>
      <div className="services-content">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <img src={service1img} className="card-img-top" alt="Service 1" />
              <div className="card-body">
                <h5 className="card-title">Purpose-Driven Programs</h5>
                <p className="card-text">We design impactful programs that address real needs and create meaningful outcomes for our community.</p>
                <Link to="/appointments" className="btn btn-primary">Learn More</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src={service2img} className="card-img-top" alt="Service 2" />
              <div className="card-body">
                <h5 className="card-title">Community Support Groups</h5>
                <p className="card-text">By collaborating with partners and participants, we foster involvement, growth, and long-term impact.</p>
                <Link to="/community" className="btn btn-primary">Join Now</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src={service3img} className="card-img-top" alt="Service 3" />
              <div className="card-body">
                <h5 className="card-title">Accessible Resources</h5>
                <p className="card-text">We provide clear, inclusive resources to ensure everyone can participate and benefit from our work.</p>
                <Link to="/resources" className="btn btn-primary">Explore</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services