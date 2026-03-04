import React from 'react'
import '../styles/home.css'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <section className="home">
      <Hero />
      <Services />
      <Testimonials />
    </section>
  )
}

export default Home