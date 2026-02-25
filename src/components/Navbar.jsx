import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <div className="logo">
                    <img src="/assests/logo.png" alt="Travel Mint" />
                    <span>Travel Mint</span>
                </div>
                <ul className="nav-links">
                    <li><a href="#rajasthan">Rajasthan</a></li>
                    <li><a href="#himachal">Himachal</a></li>
                    <li><a href="#uttarakhand">Uttarakhand</a></li>
                    <li><button className="btn-contact">Inquire</button></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
