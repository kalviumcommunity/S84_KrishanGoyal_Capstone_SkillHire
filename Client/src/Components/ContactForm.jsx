// ContactForm.jsx
import React from 'react';
import '../Styles/ContactForm.css';

const ContactForm = () => {
  return (
    <section className="contact-section" id="contact">
      <h2>We're here to assist you!</h2>
      <form className="contact-form">
        <label>
          Name*
          <input type="text" name="name" required />
        </label>
        <label>
          Email address*
          <input type="email" name="email" required />
        </label>
        <label>
          Phone number*
          <input type="tel" name="phone" required />
        </label>
        <label>
          Message
          <textarea name="message" rows="4"></textarea>
        </label>
        <label className="checkbox">
          <input type="checkbox" required /> I allow this website to store my submission so they can respond.
        </label>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default ContactForm;
