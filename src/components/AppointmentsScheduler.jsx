import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import '../styles/appointments-scheduler.css';

function AppointmentScheduler() {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_KEY);

  if (state.succeeded) {
    return <p>Thanks for using our services!</p>;
  }
  return (
    <div className="appointment-scheduler">
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          name="name"
          required
        />
        <ValidationError prefix="Name" field="name" errors={state.errors} />

        {/* Email */}
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          required
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        {/* Phone */}
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="(555) 555-5555"
        />
        <ValidationError prefix="Phone" field="phone" errors={state.errors} />

        {/* Appointment Date */}
        <label htmlFor="date">Preferred Date</label>
        <input
          id="date"
          type="date"
          name="date"
          required
        />
        <ValidationError prefix="Date" field="date" errors={state.errors} />

        {/* Appointment Time */}
        <label htmlFor="time">Preferred Time</label>
        <input
          id="time"
          type="time"
          name="time"
          required
        />
        <ValidationError prefix="Time" field="time" errors={state.errors} />

        {/* Service Type */}
        <label htmlFor="service">Service</label>
        <select id="service" name="service" required>
          <option value="">Select a service</option>
          <option value="consultation">Consultation</option>
          <option value="therapy-session">Therapy Session</option>
          <option value="follow-up">Follow-up</option>
        </select>
        <ValidationError prefix="Service" field="service" errors={state.errors} />

        {/* Message */}
        <label htmlFor="message">Additional Notes</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Anything we should know before the appointment?"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        {/* Submit */}
        <button type="submit" disabled={state.submitting}>
          {state.submitting ? "Scheduling..." : "Schedule Appointment"}
        </button>
      </form>
    </div>

  );
}

export default AppointmentScheduler;