import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './hero.css';
import eventImage1 from '../../assets/background2.png';
import { Link } from 'react-scroll';

const Hero = () => {
  const slides = [
    {
      id: 1,
      image: eventImage1,
      mainTitle: 'UTSAV EVENT\nMANAGEMENT',
      subtitle: 'Limit your distance, not your\nexperiences. Discover local\nevents, share your moments\nand win!',
      secondaryTitle: 'Events to get\nyou inspired'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      mainTitle: 'CREATE MEMORABLE\nEXPERIENCES',
      subtitle: 'Transform your ideas into\nunforgettable moments. Plan,\norganize and celebrate life\'s\nspecial occasions!',
      secondaryTitle: 'Moments that\nlast forever'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80',
      mainTitle: 'CONNECT WITH\nYOUR COMMUNITY',
      subtitle: 'Join local gatherings and\nmeet like-minded people.\nBuild connections that\nmatter most!',
      secondaryTitle: 'Community\nbonds stronger'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      mainTitle: 'CELEBRATE\nTOGETHER',
      subtitle: 'Every celebration deserves\nto be special. From intimate\ngatherings to grand festivals,\nwe make it happen!',
      secondaryTitle: 'Celebrations\nthat inspire'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [arcHeight, setArcHeight] = useState(0);

  // Scroll handler for parallax effect and arc expansion
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      setScrollY(currentScrollY);
      
      // Start the effect much earlier - after just 20-30px of scroll
      const scrollThreshold = 25; // Start after 25px of scroll
      const maxScroll = windowHeight * 0.8; // Complete expansion earlier
      
      if (currentScrollY >= scrollThreshold) {
        const scrollProgress = Math.min((currentScrollY - scrollThreshold) / (maxScroll - scrollThreshold), 1);
        // Smaller ellipse size - reduced from 1.3 to 0.9
        const height = scrollProgress * windowHeight * 0.9;
        setArcHeight(height);
      } else {
        setArcHeight(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Manual navigation
  const goToSlide = (index) => {
    if (index !== currentSlide) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  };

  // Animation variants
  const backgroundVariants = {
    enter: (direction) => ({
      opacity: 0,
      scale: 1.1,
      x: direction > 0 ? '100%' : '-100%'
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: (direction) => ({
      opacity: 0,
      scale: 0.9,
      x: direction < 0 ? '100%' : '-100%',
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 1.1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const secondaryTextVariants = {
    hidden: {
      opacity: 0,
      x: 100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  // Parallax calculations
  const backgroundTransform = `translateY(${scrollY * 0.3}px)`;
  const contentTransform = `translateY(${scrollY * 0.1}px)`;

  // Determine if we're in the hero section or secondary section
  const isHeroSection = scrollY < window.innerHeight * 0.35;

  return (
    <div className="hero-wrapper">
      {/* Arc Transition Element - positioned at exact boundary */}
      <div 
        className="hero-boundary-arc"
        style={{
          height: `${arcHeight}px`,
          opacity: arcHeight > 0 ? 1 : 0
        }}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div 
          className="hero-background"
          style={{ transform: backgroundTransform }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={backgroundVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="hero-slide-bg"
              style={{
                backgroundImage: `url(${slides[currentSlide].image})`
              }}
            />
          </AnimatePresence>
          <div className="hero-overlay"></div>
        </div>

        {/* <nav className={`hero-nav ${scrollY > 100 ? 'scrolled' : ''}`}>
          <div className="logo">
            <div className="logo-icon"></div>
          </div>
          <div className="nav-links">
            <a href="#inspiration" className="nav-link">OUR EVENTS</a>
            <a href="#join" className="nav-link">REVIEWS</a>
            <a href="#prizes" className="nav-link">CONTACT US</a>
          </div>
          <div className="language-selector">
            <span className="flag-icon">🇬🇧</span>
          </div>
        </nav> */}

        <div 
          className="hero-content"
          style={{ transform: contentTransform }}
        >
          <div className="hero-main">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="hero-title"
              >
                {slides[currentSlide].mainTitle}
              </motion.h1>
            </AnimatePresence>
            
            {isHeroSection && (
              <div className="hero-subtitle">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`subtitle-${currentSlide}`}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {isHeroSection && (
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Secondary Section */}
      <section className="hero-secondary">
        <div className="secondary-content">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`secondary-${currentSlide}`}
              variants={secondaryTextVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="secondary-title"
            >
              {slides[currentSlide].secondaryTitle}
            </motion.h2>
          </AnimatePresence>
        </div>
        
        <div className="about-section">
          <div className="about-container">
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="About Us" 
                className="about-img"
              />
            </div>
            <div className="about-text">
              <h3 className="about-title">About Us</h3>
              <p className="about-description">
                We are a passionate team dedicated to creating exceptional experiences. 
                Our journey began with a simple vision: to transform ideas into reality 
                through innovative design and cutting-edge technology.
              </p>
              <p className="about-description">
                With years of experience in the industry, we've built a reputation for 
                delivering quality solutions that exceed expectations. Our collaborative 
                approach ensures that every project reflects our commitment to excellence.
              </p>
              {/* <button className="about-cta">Explore Events</button> */}
                <Link
                to="events-section"
                smooth={true}
                duration={500}
                offset={-70} // optional: offset for sticky navbar
                >
                <button className="about-cta">Explore Events</button>
                </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
