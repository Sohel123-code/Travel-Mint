import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StateSection from './components/StateSection';
import StateDetail from './components/StateDetail';
import './App.css';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function App() {
    const [selectedState, setSelectedState] = useState(null);
    const [states, setStates] = useState([
        {
            id: 'rajasthan',
            title: 'Rajasthan',
            subtitle: 'The Land of Kings',
            description: 'Experience the regal splendor of Indias desert jewel. From the golden sands of the Thar to the majestic forts and palaces that whisper tales of valor and royalty.',
            image: 'https://images.unsplash.com/photo-1599661046289-e318878433ca?q=80&w=2000&auto=format&fit=crop', // fallback
            query: 'scenic Amber Fort Jaipur luxury architecture',
            color: '#C6A75E'
        },
        {
            id: 'himachal',
            title: 'Himachal Pradesh',
            subtitle: 'The Abode of Snow',
            description: 'Nestled in the lap of the Himalayas, Himachal offers a serene escape into lush valleys, snow-capped peaks, and crystalline rivers. A perfect sanctuary for nature lovers.',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d926b12d?q=80&w=2000&auto=format&fit=crop', // fallback
            query: 'scenic Manali mountains snow nature luxury landscape',
            color: '#2C2C34'
        },
        {
            id: 'uttarakhand',
            title: 'Uttarakhand',
            subtitle: 'The Land of Gods',
            description: 'A spiritual and natural sanctuary where high altitude mountains meet emerald waters. Discover the tranquility of the Himalayas in its purest and most majestic form.',
            image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2000&auto=format&fit=crop', // fallback
            query: 'scenic Rishikesh mountains Ganga river nature landscape',
            color: '#C6A75E'
        }
    ]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const updatedStates = await Promise.all(
                    states.map(async (state) => {
                        const response = await fetch(
                            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(state.query)}&orientation=landscape&per_page=1`,
                            { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
                        );
                        const data = await response.json();
                        if (data.results?.length > 0) return { ...state, image: data.results[0].urls.regular };
                        return state;
                    })
                );
                setStates(updatedStates);
            } catch (error) { console.error("Unsplash error:", error); }
        };
        if (ACCESS_KEY) fetchImages();
    }, []);

    const handleDiscoverMore = (id) => {
        setSelectedState(id);
        window.scrollTo(0, 0);
    };

    const handleHome = () => setSelectedState(null);

    const currentState = states.find(s => s.id === selectedState);

    return (
        <div className="app">
            <Navbar onHome={handleHome} onStateClick={(id) => { setSelectedState(id); window.scrollTo(0, 0); }} />

            {!selectedState ? (
                <>
                    <Hero />
                    <main>
                        {states.map((state, index) => (
                            <StateSection
                                key={state.id}
                                state={state}
                                reverse={index % 2 !== 0}
                                onDiscoverMore={() => handleDiscoverMore(state.id)}
                            />
                        ))}
                    </main>
                </>
            ) : (
                <StateDetail state={currentState} onBack={handleHome} />
            )}

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 Travel Mint. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
