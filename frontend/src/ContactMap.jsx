import React, { useState } from 'react';
import axios from 'axios';
import './ContactMap.css';

const ContactMap = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [formStatus, setFormStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/contact', formData);
            setFormStatus('Message sent successfully!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormStatus('Failed to send the message. Please try again.');
        }
    };

    return (
        <>
            <section className="contact" id="contact">
                <h1 className="title"><span>Contact</span> us</h1>
                <div className="contents">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.9436505113667!2d72.86583217939337!3d19.241287435579697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b1006bbabae5%3A0x52f18e10c01d4f52!2sSiddhivinayak%20gym!5e0!3m2!1sen!2sin!4v1719867425687!5m2!1sen!2sin"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <form onSubmit={handleSubmit}>
                        <h3>Gym Contact Us</h3>
                        <span className="fas fa-user"></span>
                        <input
                            className="inputbox"
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <span className="fas fa-envelope"></span>
                        <input
                            className="inputbox"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="inputbox"
                            type="text"
                            name="subject"
                            placeholder="Enter the subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Enter your message"
                            className="inputbox"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn">
                            Submit
                        </button>
                        {formStatus && <p className="form-status">{formStatus}</p>}
                    </form>
                </div>
            </section>
        </>
    );
}

export default ContactMap;
