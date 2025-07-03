import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import './navbar.css';

import logoImage from '../../assets/logo.png'; 
import { useAnimate } from 'framer-motion';

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Determine navbar classes - simplified without inverted and split
  const getNavbarClasses = () => {
    let classes = 'navbar';
    if (scrollY > 690) classes += ' scrolled';
    return classes;
  };

  return (
    <nav className={getNavbarClasses()}>
      <div className="navbar-container">
        <div className="logo">
          <img src={logoImage} alt="Logo" />
        </div>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link 
            to="events-section" 
            smooth={true} 
            offset={0} 
            duration={500} 
            className="nav-link"
            activeClass="active"
            spy={true}
            data-text="OUR EVENTS" 
          >
            OUR EVENTS
          </Link>
          <Link 
            to="reviews-section" 
            smooth={true} 
            offset={0} 
            duration={500} 
            className="nav-link"
            activeClass="active"
            spy={true}
            data-text="REVIEWS" 
          >
            REVIEWS
          </Link>
          <Link 
            to="forms-section" 
            smooth={true} 
            offset={0} 
            duration={500} 
            className="nav-link"
            activeClass="active"
            spy={true}
            data-text="CONTACT US" 
          >
            CONTACT US
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link 
              to="events-section" 
              smooth={true} 
              offset={0} 
              duration={500} 
              onClick={closeMobileMenu}
            >
              OUR EVENTS
            </Link>
          </li>
          <li>
            <Link 
              to="reviews-section" 
              smooth={true} 
              offset={0} 
              duration={500} 
              onClick={closeMobileMenu}
            >
              REVIEWS
            </Link>
          </li>
          <li>
            <Link 
              to="forms-section" 
              smooth={true} 
              offset={0} 
              duration={500} 
              onClick={closeMobileMenu}
            >
              CONTACT US
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;