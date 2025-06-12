import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './events.css';

const Events = () => {
  const containerRef = useRef(null);
 
  // Sample events data
  const events = [
    {
      id: 1,
      image: "/path-to-event1.jpg",
      title: "Tech Conference 2024",
      description: "A comprehensive gathering of industry leaders discussing the latest in technology innovation and future trends."
    },
    {
      id: 2,
      image: "/path-to-event2.jpg",
      title: "Design Workshop",
      description: "An interactive workshop focusing on modern design principles and creative problem-solving methodologies."
    },
    {
      id: 3,
      image: "/path-to-event3.jpg",
      title: "Startup Pitch Night",
      description: "An evening where emerging entrepreneurs present their innovative ideas to potential investors and mentors."
    },
    {
      id: 4,
      image: "/path-to-event4.jpg",
      title: "Digital Art Exhibition",
      description: "A showcase of contemporary digital art pieces from talented artists around the world."
    },
    {
      id: 5,
      image: "/path-to-event5.jpg",
      title: "Networking Mixer",
      description: "A professional networking event bringing together industry professionals from various sectors."
    },
    {
      id: 6,
      image: "/path-to-event6.jpg",
      title: "Innovation Summit",
      description: "A summit dedicated to exploring breakthrough innovations and their impact on society and business."
    }
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  const handleSeeMoreClick = () => {
    // Replace with your actual Google Drive link
    window.open('https://drive.google.com/drive/folders/dummy-folder-id', '_blank');
  };

  return (
    <div className="events-section" ref={containerRef}>
      <div className="events-container">
        <motion.div
          className="events-header"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="events-title">Events We Have Organised</h2>
          <div className="scroll-hint">
            <span className="scroll-hint-text">← Scroll horizontally to view more events →</span>
          </div>
        </motion.div>
       
        <div className="events-scroll-container">
          <motion.div
            className="events-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="event-card"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="event-image-container">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                  <div className="event-overlay"></div>
                </div>
                <div className="event-content">
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* See More Button */}
        <motion.div
          className="see-more-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button 
            className="form-submit-btn see-more-btn"
            onClick={handleSeeMoreClick}
            style={{ textAlign: 'center' }}
          >
            Gallery →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;