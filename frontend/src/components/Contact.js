// src/components/Contact.js
// import React, { useState } from 'react';
import React from 'react';
const Contact = () => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   message: ''
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission here
  //   console.log('Contact form data:', formData);
  //   alert('Thank you for your message! We will get back to you soon.');
  //   setFormData({ name: '', email: '', message: '' });
  // };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <div className="contact-content">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p>Have questions? We'd love to hear from you.</p>
          <div className="contact-details">
            <p>Email: info@censusmanagement.com</p>
            <p>Phone: (123) 456-7890</p>
            <p>Address: 123 Census Street, City, Country</p>
          </div>
        </div>
 
        {/* <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows="5"
            ></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form> */}
      </div>
    </div>
  );
};

export default Contact;