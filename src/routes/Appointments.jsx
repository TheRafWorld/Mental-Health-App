import React from 'react'
import '../styles/appointments.css'
import AppointmentScheduler from '../components/AppointmentsScheduler'

const Appointments = () => {
  return (
    <section className="appointments">
      <h1>Appointments Page</h1>
      <p>This is where users can schedule and manage their appointments.</p>
      <AppointmentScheduler />
    </section>
  )
}

export default Appointments