import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Info, Calendar, Wallet, Shield, Users, Landmark, MapPin, Loader2 } from 'lucide-react';
import { groq } from '../utils/groqClient';
import './AttractionDetail.css';

const AttractionDetail = ({ attraction, stateName, onBack }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const prompt = `Provide detailed travel information for ${attraction.place} in ${stateName}, India in JSON format with these exact keys:
                "name", "short_description", "location", "category", "best_time_to_visit", "entry_fee", "timings", "ideal_visit_duration", "approximate_cost_per_person", "safety_tips".
                Keep responses concise and helpful. Safety tips should be a list of 3 items.`;

                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile",
                    response_format: { type: "json_object" }
                });

                const result = JSON.parse(completion.choices[0]?.message?.content);
                setDetails(result);
            } catch (e) {
                console.error("Groq details error:", e);
                // Fallback
                setDetails({
                    name: attraction.place,
                    short_description: attraction.description,
                    location: stateName,
                    category: "Landmark",
                    best_time_to_visit: "October to March",
                    entry_fee: "Varies",
                    timings: "9:00 AM - 6:00 PM",
                    ideal_visit_duration: "2-3 Hours",
                    approximate_cost_per_person: "₹500 - ₹1000",
                    safety_tips: ["Stay hydrated", "Follow local guidelines", "Keep belongings safe"]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
        window.scrollTo(0, 0);
    }, [attraction.place, stateName]);

    if (loading) {
        return (
            <div className="attraction-detail-loading">
                <Loader2 className="animate-spin" size={48} />
                <p>Generating local insights for {attraction.place}...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="attraction-detail-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <button className="btn-back-to-list" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Attractions
            </button>

            <div className="container">
                <div className="detail-header-section">
                    <span className="location-tag"><MapPin size={16} /> {stateName}, India</span>
                    <h1>{attraction.place}</h1>
                </div>
            </div>

            <div className="detail-hero">
                <img src={attraction.imageUrl} alt={attraction.place} />
            </div>

            <div className="container detail-container">
                <div className="detail-main-content">
                    <section className="info-section">
                        <h2><Info size={24} /> About</h2>
                        <p>{details?.short_description}</p>
                    </section>

                    <div className="quick-factors">
                        <div className="factor-card">
                            <Landmark size={20} />
                            <div className="factor-text">
                                <label>Category</label>
                                <span>{details?.category}</span>
                            </div>
                        </div>
                        <div className="factor-card">
                            <Calendar size={20} />
                            <div className="factor-text">
                                <label>Best Time</label>
                                <span>{details?.best_time_to_visit}</span>
                            </div>
                        </div>
                        <div className="factor-card">
                            <Clock size={20} />
                            <div className="factor-text">
                                <label>Timings</label>
                                <span>{details?.timings}</span>
                            </div>
                        </div>
                        <div className="factor-card">
                            <Users size={20} />
                            <div className="factor-text">
                                <label>Ideal Duration</label>
                                <span>{details?.ideal_visit_duration}</span>
                            </div>
                        </div>
                        <div className="factor-card">
                            <Wallet size={20} />
                            <div className="factor-text">
                                <label>Entry Fee</label>
                                <span>{details?.entry_fee}</span>
                            </div>
                        </div>
                        <div className="factor-card">
                            <Wallet size={20} />
                            <div className="factor-text">
                                <label>Approx. Cost</label>
                                <span>{details?.approximate_cost_per_person}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="detail-sidebar">
                    <div className="sidebar-card safety-card">
                        <h3><Shield size={20} /> Safety Tips</h3>
                        <ul>
                            {Array.isArray(details?.safety_tips) ?
                                details.safety_tips.map((tip, i) => <li key={i}>{tip}</li>) :
                                <li>{details?.safety_tips}</li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AttractionDetail;
