import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import './Navbar.css';

import logoImage from '../../assets/logo.png'; 

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

  // Calculate navbar states based on scroll position
  const shouldInvert = scrollY > window.innerHeight * 3 && scrollY <= window.innerHeight * 4;
  const shouldSplit = scrollY > window.innerHeight * 5;
  
  // Determine navbar classes
  const getNavbarClasses = () => {
    let classes = 'navbar';
    if (scrollY > 690) classes += ' scrolled';
    if (shouldInvert) classes += ' inverted';
    if (shouldSplit) classes += ' split';
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
            className="nav-link reviews-link"
            activeClass="active"
            spy={true}
            data-text="REVIEWS" 
        >
            {shouldSplit ? (
              <>
                <span className="reviews-left">REVI</span>
                <span className="reviews-right">EWS</span>
              </>
            ) : (
              "REVIEWS"
            )}
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