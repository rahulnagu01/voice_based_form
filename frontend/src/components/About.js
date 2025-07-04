// src/components/About.js
import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h2>About Census Management System</h2>
      <div className="about-content">
        <section>
          <h3>Our Mission</h3>
          <p>
            To provide an efficient and accurate census data collection system that 
            helps in gathering demographic information through a user-friendly interface.
          </p>
        </section>

        <section>
          <h3>Features</h3>
          <ul>
            <li>Voice-assisted form filling capability</li>
            <li>Secure data management</li>
            <li>Easy access to census information</li>
            <li>Efficient officer management</li>
          </ul>
        </section>

        <section>
          <h3>How It Works</h3>
          <p>
            Our system allows officers to collect census data efficiently while 
            maintaining data security and accuracy. Citizens can easily access their 
            census information using their Aadhaar number.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;