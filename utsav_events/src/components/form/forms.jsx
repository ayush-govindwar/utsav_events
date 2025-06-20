import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Forms = () => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    eventType: '',
    priceRange: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showRedirectOverlay, setShowRedirectOverlay] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const eventOptions = [
    'Corporate Event',
    'Wedding',
    'Birthday Party',
    'Conference',
    'Product Launch',
    'Networking Event',
    'Workshop',
    'Seminar',
    'Exhibition',
    'Other'
  ];

  const priceRanges = [
    { label: '₹1,000 - ₹5,000', value: '1-5 th' },
    { label: '₹5,000 - ₹10,000', value: '5-10 th' },
    { label: '₹10,000 - ₹25,000', value: '10-25 th' },
    { label: '₹25,000 - ₹50,000', value: '25-50 th' },
    { label: '₹50,000 - ₹1,00,000', value: '50-100 th' },
    { label: 'Above ₹1,00,000', value: '100+ th' }
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return false; // Phone is required
    // Indian phone number validation (10 digits, can start with +91)
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.eventType) {
      errors.eventType = 'Please select an event type';
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const requestData = {
        full_name: formData.name.trim(),
        phone_number: formData.phoneNumber.trim(),
        ...(formData.email.trim() && { email: formData.email.trim() }),
        event_type: formData.eventType,
        ...(formData.priceRange && { budget_range: formData.priceRange }),
        ...(formData.description.trim() && { additional_details: formData.description.trim() })
      };

      console.log('Sending data:', requestData);

      const response = await fetch('https://utsav-events-backend1.onrender.com/api/submit-inquiry/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        
        setSubmitStatus('success');
        
        // Clear the form
        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
          eventType: '',
          priceRange: '',
          description: ''
        });

        // Show redirect overlay and redirect immediately
        if (responseData.whatsapp_url) {
          setShowRedirectOverlay(true);
          console.log('WhatsApp URL:', responseData.whatsapp_url);
          
          // Redirect immediately
          setTimeout(() => {
            window.open(responseData.whatsapp_url, '_blank');
            setShowRedirectOverlay(false);
          }, 100); // Minimal delay for overlay to show
        }
        
      } else {
        const responseText = await response.text();
        console.error('Error response status:', response.status);
        console.error('Error response text:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('Parsed error data:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response as JSON');
        }
        
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    let className = 'form-input';
    if (validationErrors[fieldName]) {
      className += ' form-input-error';
    } else if (formData[fieldName] && fieldName === 'email' && formData[fieldName]) {
      className += validateEmail(formData[fieldName]) ? ' form-input-valid' : ' form-input-error';
    } else if (formData[fieldName] && fieldName === 'phoneNumber' && formData[fieldName]) {
      className += validatePhoneNumber(formData[fieldName]) ? ' form-input-valid' : ' form-input-error';
    } else if (formData[fieldName] && fieldName === 'name' && formData[fieldName].trim()) {
      className += ' form-input-valid';
    }
    return className;
  };

  const getSelectClassName = (fieldName) => {
    let className = 'form-select';
    if (validationErrors[fieldName]) {
      className += ' form-select-error';
    } else if (formData[fieldName]) {
      className += ' form-select-valid';
    }
    return className;
  };

  return (
    <div className="forms-section" ref={containerRef}>
      <div className="forms-container">
        <motion.div 
          className="forms-header"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="forms-title">Contact Us</h2>
          <p className="forms-subtitle">Let's bring your vision to life</p>
        </motion.div>
        
        <motion.div 
          className="form-wrapper"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={getInputClassName('name')}
                placeholder="Enter your full name"
              />
              {validationErrors.name && (
                <span className="validation-error">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={getInputClassName('phoneNumber')}
                placeholder="Enter your phone number"
              />
              {validationErrors.phoneNumber && (
                <span className="validation-error">{validationErrors.phoneNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address 
                <span className="optional-label">(Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={getInputClassName('email')}
                placeholder="Enter your email address"
              />
              {validationErrors.email && (
                <span className="validation-error">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="eventType" className="form-label">Event Type *</label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className={getSelectClassName('eventType')}
              >
                <option value="">Select event type</option>
                {eventOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              {validationErrors.eventType && (
                <span className="validation-error">{validationErrors.eventType}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priceRange" className="form-label">
                Budget Range 
                <span className="optional-label">(Optional)</span>
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select budget range (optional)</option>
                {priceRanges.map((range, index) => (
                  <option key={index} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Additional Details 
                <span className="optional-label">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                placeholder="Tell us more about your event vision, special requirements, or any questions you have..."
              />
            </div>

            <motion.button
              type="submit"
              className="form-submit-btn"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Submitting...' : 'Send via WhatsApp'}
            </motion.button>

            {submitStatus === 'success' && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="success-content">
                  <div className="success-icon">✅</div>
                  <div className="success-text">
                    <h4>Form submitted successfully!</h4>
                    <p>We've sent you a confirmation email and are redirecting you to WhatsApp...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="error-content">
                  <div className="error-icon">❌</div>
                  <div className="error-text">
                    <h4>Something went wrong!</h4>
                    <p>Please try again or contact us directly.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Redirect Overlay */}
        <AnimatePresence>
          {showRedirectOverlay && (
            <motion.div
              className="redirect-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="redirect-content">
                <div className="redirect-spinner"></div>
                <h3>Redirecting to WhatsApp...</h3>
                <p>Please wait while we redirect you</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx>{`
          /* Validation Styles */
          .form-input-valid {
            border-color: #28a745 !important;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
          }

          .form-input-error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
          }

          .form-select-valid {
            border-color: #28a745 !important;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
          }

          .form-select-error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
          }

          .validation-error {
            display: block;
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
            font-weight: 500;
          }

          /* Redirect Overlay Styles */
          .redirect-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
          }

          .redirect-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
          }

          .redirect-content h3 {
            margin: 20px 0 10px 0;
            color: #333;
            font-size: 24px;
            font-weight: 600;
          }

          .redirect-content p {
            margin: 0;
            color: #666;
            font-size: 16px;
          }

          .redirect-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e0e0e0;
            border-top: 4px solid #333;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Base form styles */
          .forms-section {
            background: #f8f9fa;
            padding: 100px 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .forms-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
            width: 100%;
          }

          .forms-header {
            text-align: center;
            margin-bottom: 60px;
          }

          .forms-title {
            font-size: clamp(3rem, 6vw, 4.5rem);
            font-weight: 300;
            color: #333;
            line-height: 1.2;
            letter-spacing: -0.02em;
            font-style: italic;
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
            margin: 0 0 15px 0;
          }

          .forms-subtitle {
            font-size: 1.2rem;
            color: #666;
            font-weight: 300;
            margin: 0;
          }

          .form-wrapper {
            display: flex;
            justify-content: center;
            width: 100%;
          }

          .contact-form {
            background: #ffffff;
            padding: 50px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            border: 1px solid rgba(0, 0, 0, 0.05);
          }

          .form-group {
            margin-bottom: 30px;
          }

          .form-label {
            display: block;
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
            letter-spacing: 0.02em;
          }

          .optional-label {
            font-size: 14px;
            color: #999;
            font-weight: 400;
            font-style: italic;
            margin-left: 5px;
          }

          .form-input,
          .form-select,
          .form-textarea {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 16px;
            color: #333;
            background: #ffffff;
            transition: all 0.3s ease;
            font-family: inherit;
            box-sizing: border-box;
          }

          .form-input:focus,
          .form-select:focus,
          .form-textarea:focus {
            outline: none;
            border-color: #333;
            box-shadow: 0 0 0 3px rgba(51, 51, 51, 0.1);
            transform: translateY(-2px);
          }

          .form-input::placeholder,
          .form-textarea::placeholder {
            color: #999;
            font-style: italic;
          }

          .form-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 15px center;
            background-size: 20px;
            padding-right: 50px;
          }

          .form-textarea {
            resize: vertical;
            min-height: 120px;
            line-height: 1.6;
          }

          .form-submit-btn {
            width: 100%;
            padding: 18px 30px;
            background: #333;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            letter-spacing: 0.02em;
            margin-top: 20px;
          }

          .form-submit-btn:hover {
            background: #222;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(51, 51, 51, 0.3);
          }

          .form-submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .success-message {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            color: #155724;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-top: 20px;
            border: 1px solid #c3e6cb;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .success-content {
            display: flex;
            align-items: center;
            gap: 15px;
            justify-content: center;
          }

          .success-icon {
            font-size: 24px;
            flex-shrink: 0;
          }

          .success-text {
            text-align: left;
          }

          .success-text h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .success-text p {
            margin: 0;
            font-size: 14px;
            opacity: 0.8;
          }

          .error-message {
            margin-top: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%);
            border: 1px solid #f1aeb5;
            border-radius: 12px;
            color: #721c24;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .error-content {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .error-icon {
            font-size: 24px;
            flex-shrink: 0;
          }

          .error-text h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .error-text p {
            margin: 0;
            font-size: 14px;
            opacity: 0.8;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .forms-section {
              padding: 80px 0;
            }
            
            .forms-container {
              padding: 0 15px;
            }
            
            .contact-form {
              padding: 40px 30px;
              margin: 0 10px;
            }
            
            .forms-header {
              margin-bottom: 40px;
            }
            
            .form-group {
              margin-bottom: 25px;
            }
            
            .form-input,
            .form-select,
            .form-textarea {
              padding: 12px 15px;
              font-size: 15px;
            }
            
            .form-submit-btn {
              padding: 15px 25px;
              font-size: 16px;
            }

            .success-content,
            .error-content {
              flex-direction: column;
              text-align: center;
              gap: 10px;
            }
            
            .success-icon,
            .error-icon {
              font-size: 20px;
            }
            
            .success-text h4,
            .error-text h4 {
              font-size: 15px;
            }
            
            .success-text p,
            .error-text p {
              font-size: 13px;
            }

            .optional-label {
              font-size: 12px;
              display: block;
              margin-left: 0;
              margin-top: 2px;
            }
            
            .success-content,
            .error-content {
              flex-direction: column;
              text-align: center;
              gap: 10px;
            }
            
            .success-text,
            .error-text {
              text-align: center;
            }

            .redirect-content {
              padding: 30px 20px;
            }

            .redirect-content h3 {
              font-size: 20px;
            }

            .redirect-content p {
              font-size: 14px;
            }
          }

          @media (max-width: 480px) {
            .contact-form {
              padding: 30px 20px;
              margin: 0 5px;
            }
            
            .forms-title {
              font-size: 2.5rem;
            }
            
            .forms-subtitle {
              font-size: 1rem;
            }
            
            .form-input,
            .form-select,
            .form-textarea {
              padding: 10px 12px;
              font-size: 14px;
            }
            
            .form-textarea {
              min-height: 100px;
            }

            .optional-label {
              font-size: 11px;
            }

            .validation-error {
              font-size: 12px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Forms;