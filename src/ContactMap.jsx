import "./ContactMap.css";
import React, { useState } from 'react';
const ContactMap = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };
    return (
        <>
            <section className="contact" id="contact">
                <h1 className="title"><span>Contact</span> us</h1>
                <div className="contents">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.9436505113667!2d72.86583217939337!3d19.241287435579697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b1006bbabae5%3A0x52f18e10c01d4f52!2sSiddhivinayak%20gym!5e0!3m2!1sen!2sin!4v1719867425687!5m2!1sen!2sin"></iframe>
                    <form action="">
                        <h3>Gym Contact Us</h3>
                        <span className="fas fa-user"></span>
                        <input className="inputbox" type="text" name="name" placeholder="Enter your name" />
                        <span className="fas fa-envelope"></span>
                        <input className="inputbox" type="email" name="email" placeholder="email" />
                        <input className='inputbox' type="text" name="subject" placeholder="Enter the subject" value={formData.subject} onChange={handleChange} />
                        <textarea name="message" placeholder="Enter your message" className="inputbox" value={formData.message} onChange={handleChange} />
                        <button type="submit" className="btn">
                            Submit
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
export default ContactMap;