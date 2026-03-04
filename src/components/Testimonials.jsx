import React from 'react';
import '../styles/testimonials.css';
import { 
  testimonial1, testimonial2, testimonial3, testimonial4, 
  testimonial5, testimonial6, testimonial8, testimonial9, 
  testimonial10, testimonial11, testimonial12 
} from '../assets/assets.js';

const testimonialData = [
  { name: "Maya R.", text: "I used to feel like I had to hide my anxiety from everyone. Talking about it openly and seeking help has been life-changing.", img: testimonial1 },
  { name: "Jamal T.", text: "There were days I couldn’t get out of bed, but joining a support group made me realize I’m not alone.", img: testimonial2 },
  { name: "Sofia L.", text: "I started journaling and speaking with a counselor when things felt overwhelming.", img: testimonial3 },
  { name: "Alex P.", text: "Talking about mental health openly has been liberating.", img: testimonial4 },
  { name: "Nina K.", text: "Joining a support group helped me feel seen and understood.", img: testimonial5 },
  { name: "Leo S.", text: "Therapy has helped me manage anxiety better than I imagined.", img: testimonial6 }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="container text-center">
        <h1 className="fw-bold mb-2">Testimonials</h1>
        <p className="text-muted mb-5">Real stories from our community members about their journey to wellness.</p>
      </div>

      {/* This acts as the 'window' that hides the overflow */}
      <div className="testimonials-carousel-wrapper">
        <div className="testimonials-carousel">
          <div className="group">
            {testimonialData.map((t, i) => (
              <div className="card testimonial-card" key={`g1-${i}`}>
                <img src={t.img} alt={t.name} className="testimonial-image" />
                <h3 className="name">{t.name}</h3>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>

          <div aria-hidden="true" className="group">
            {testimonialData.map((t, i) => (
              <div className="card testimonial-card" key={`g2-${i}`}>
                <img src={t.img} alt={t.name} className="testimonial-image" />
                <h3 className="name">{t.name}</h3>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;