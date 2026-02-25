import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { groq } from '../utils/groqClient';
import { Loader2, MapPin } from 'lucide-react';
import './TopAttractions.css';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY2;

const TopAttractions = ({ stateId, stateName }) => {
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttractions = async () => {
            setLoading(true);
            try {
                // 1. Fetch from Supabase
                const tableName = stateId.toLowerCase();
                let { data, error: sbError } = await supabase
                    .from(tableName)
                    .select('*');

                if (sbError || !data || data.length === 0) {
                    // Try capitalized if lowercase fails
                    const capitalizedTable = stateId.charAt(0).toUpperCase() + stateId.slice(1);
                    const retry = await supabase.from(capitalizedTable).select('*');
                    if (!retry.error && retry.data) data = retry.data;
                    else throw sbError || retry.error;
                }

                if (!data || data.length === 0) {
                    setAttractions([]);
                    setLoading(false);
                    return;
                }

                // 2. Fetch images and descriptions for each place
                const enrichedData = await Promise.all(data.slice(0, 6).map(async (item) => {
                    const place = item.place || item.name;

                    // Fetch Image from Unsplash
                    let imageUrl = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop';
                    try {
                        const searchQuery = `${place} ${stateName} landmark travel photography architecture`;
                        const imgRes = await fetch(
                            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=squarish`,
                            { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
                        );
                        const imgData = await imgRes.json();
                        if (imgData.results?.length > 0) imageUrl = imgData.results[0].urls.regular;
                    } catch (e) { console.error("Unsplash error:", e); }

                    // Generate Description from Groq
                    let description = "Discover the unique charm and history of this remarkable destination.";
                    try {
                        const completion = await groq.chat.completions.create({
                            messages: [{ role: "user", content: `Write a compelling 20-word travel description for ${place} in ${stateName}, India. Focus on its uniqueness.` }],
                            model: "llama-3.3-70b-versatile",
                        });
                        description = completion.choices[0]?.message?.content || description;
                    } catch (e) { console.error("Groq error:", e); }

                    return { ...item, imageUrl, description, place };
                }));

                setAttractions(enrichedData);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError("Failed to load attractions structure.");
            } finally {
                setLoading(false);
            }
        };

        if (stateId) fetchAttractions();
    }, [stateId, stateName]);

    if (loading) return <div className="attractions-status"><Loader2 className="animate-spin" /> Gathering the best spots...</div>;
    if (error) return <div className="attractions-status text-error">{error}</div>;

    return (
        <div className="top-attractions">
            <h3 className="attractions-heading">Top Attractions</h3>
            <div className="attractions-grid">
                {attractions.map((attr, idx) => (
                    <motion.div
                        key={idx}
                        className="attraction-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="attraction-image-container">
                            <img src={attr.imageUrl} alt={attr.place} />
                        </div>
                        <div className="attraction-info">
                            <div className="attraction-header">
                                <MapPin size={16} className="pin-icon" />
                                <h4>{attr.place}</h4>
                            </div>
                            <p>{attr.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TopAttractions;
