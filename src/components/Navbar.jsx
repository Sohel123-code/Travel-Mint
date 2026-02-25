import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <div className="logo">
                    <img src="/assests/logo.png" alt="Travel Mint" />
                    <span>Travel Mint</span>
                </div>

                <div className={`nav-toggle ${mobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                    <li><a href="#rajasthan" onClick={() => setMobileMenuOpen(false)}>Rajasthan</a></li>
                    <li><a href="#himachal" onClick={() => setMobileMenuOpen(false)}>Himachal</a></li>
                    <li><a href="#uttarakhand" onClick={() => setMobileMenuOpen(false)}>Uttarakhand</a></li>
                    <li><button className="btn-contact">Inquire</button></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
