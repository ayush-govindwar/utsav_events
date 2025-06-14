import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './reviews.css';

const Reviews = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      review: "Absolutely fantastic service! The team went above and beyond to make our event memorable. Every detail was perfectly executed."
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      review: "Professional, creative, and reliable. They transformed our vision into reality and exceeded all expectations. Highly recommended!"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      review: "Great experience working with this team. The event was well-organized and the attention to detail was impressive."
    },
    {
      id: 4,
      name: "David Thompson",
      rating: 5,
      review: "Outstanding work! They made our corporate event seamless and engaging. The professionalism was top-notch throughout."
    },
    {
      id: 5,
      name: "Lisa Park",
      rating: 5,
      review: "Incredible creativity and execution. Our wedding was perfect thanks to their meticulous planning and beautiful design."
    },
    {
      id: 6,
      name: "James Wilson",
      rating: 4,
      review: "Very pleased with the service. The team was responsive, professional, and delivered exactly what we envisioned."
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrollActive) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [reviews.length, isAutoScrollActive]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    pauseAutoScroll();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    pauseAutoScroll();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    pauseAutoScroll();
  };

  const pauseAutoScroll = () => {
    setIsAutoScrollActive(false);
    setTimeout(() => setIsAutoScrollActive(true), 8000); // Resume after 8 seconds
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Click handlers for desktop
  const handleCardClick = (index) => {
    if (index === currentIndex) return; // Don't do anything if clicking active card
    
    const leftIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    const rightIndex = (currentIndex + 1) % reviews.length;
    
    if (index === leftIndex) {
      goToPrevious();
    } else if (index === rightIndex) {
      goToNext();
    } else {
      goToSlide(index);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  const getCardClass = (index) => {
    if (index === currentIndex) return 'review-card active';
    if (index === (currentIndex - 1 + reviews.length) % reviews.length) return 'review-card left';
    if (index === (currentIndex + 1) % reviews.length) return 'review-card right';
    return 'review-card hidden';
  };

  return (
    <div className="reviews-section" id="reviews-section" ref={containerRef}>
      <div className="reviews-container">
        <motion.div 
          className="reviews-header"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="reviews-title">What our customers say...</h2>
        </motion.div>
        
        <div className="reviews-carousel-container">
          <motion.div 
            className="reviews-carousel"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className={getCardClass(index)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleCardClick(index)}
                style={{ cursor: index !== currentIndex ? 'pointer' : 'default' }}
              >
                <div className="review-content">
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-text">"{review.review}"</p>
                  <div className="review-author">
                    <h4 className="reviewer-name">{review.name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Carousel indicators */}
          <div className="carousel-indicators">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;