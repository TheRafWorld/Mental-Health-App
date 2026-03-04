import React from 'react'
import CrisisBanner from '../components/CrisisBanner'
import '../styles/resources.css'
import FindTherapists from '../components/FindTherapists'

const Resources = () => {
  return (
    <section className="resources">
      <CrisisBanner />

      <div className="container-fluid py-5 bg-light text-center">
        <h1 className="fw-bold">Mental Health Resources</h1>
        <p className="lead mt-3">
          Trusted support, information, and tools to help you navigate mental well-being.
        </p>
      </div>

      <FindTherapists />


    </section>
  )
}

export default Resources