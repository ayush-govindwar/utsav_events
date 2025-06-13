import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './forms.css';

const Forms = () => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    eventType: '',
    priceRange: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  // Updated price ranges to match backend expectations
  const priceRanges = [
    { label: '$1,000 - $5,000', value: '1-5 th' },
    { label: '$5,000 - $10,000', value: '5-10 th' },
    { label: '$10,000 - $25,000', value: '10-25 th' },
    { label: '$25,000 - $50,000', value: '25-50 th' },
    { label: '$50,000 - $100,000', value: '50-100 th' },
    { label: 'Above $100,000', value: '100+ th' }
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Transform the data to match backend expectations exactly
      const requestData = {
        full_name: formData.name.trim(),
        phone_number: formData.phoneNumber.trim(),
        event_type: formData.eventType,
        // Only include budget_range if it's selected (now optional)
        ...(formData.priceRange && { budget_range: formData.priceRange }),
        // Only include additional_details if it has content
        ...(formData.description.trim() && { additional_details: formData.description.trim() })
      };

      console.log('Sending data:', requestData); // Debug log
      console.log('Original form data:', formData); // Debug log

      const response = await fetch('http://127.0.0.1:8000/api/submit-inquiry/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status); // Debug log
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData); // Debug log
        setSubmitStatus('success');
        setFormData({
          name: '',
          phoneNumber: '',
          eventType: '',
          priceRange: '',
          description: ''
        });
      } else {
        // Try to get error details from response
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
                className="form-input"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventType" className="form-label">Event Type *</label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select event type</option>
                {eventOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priceRange" className="form-label">Budget Range (Optional)</label>
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
              <label htmlFor="description" className="form-label">Additional Details (Optional)</label>
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
              {isSubmitting ? 'Submitting...' : 'Send Message'}
            </motion.button>

            {submitStatus === 'success' && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thank you! We'll get back to you soon.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Something went wrong. Please try again.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Forms;