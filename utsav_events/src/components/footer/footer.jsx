import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './footer.css';

const Footer = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const leftOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0, 0.3], [-50, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  return (
    <footer className="footer-section" ref={containerRef}>
      <div className="footer-container">
        {/* Left Section - Dark */}
        <motion.div 
          className="footer-left"
          style={{ opacity: leftOpacity, x: leftX }}
        >
          <div className="footer-content">
            <div className="footer-logo">
              <h3 className="company-name">Utsav Events</h3>
              <p className="company-tagline">Creating Memorable Experiences</p>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>Address</h4>
                  <p>Third Floor, Sanidhya, C-25, near Bitwise Terratower,<br /> Mohan Nagar Co-Op Society,<br />Baner, Pune, Maharashtra 411045</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>utsavevents@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div className="contact-details">
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                     Saturday: 10:00 AM - 4:00 PM<br />
                     Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Light with Map */}
        <motion.div 
          className="footer-right"
          style={{ opacity: rightOpacity, x: rightX }}
        >
          <div className="map-section">
            <h3 className="map-title">Find Us</h3>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.3961846032785!2d73.76335297519257!3d18.556168982544275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfbf1854ff31%3A0xc05c519eace91f93!2sUtsav%20Event%20Management%20and%20caterers!5e0!3m2!1sen!2sin!4v1749619422181!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Business Location"
              ></iframe>
            </div>
            <div className="map-info">
              <p>Visit our office for a consultation or to discuss your event planning needs. 
                 We're conveniently located in the heart of the city with easy access to 
                 public transportation and parking facilities.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2024 Utsav Events. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;