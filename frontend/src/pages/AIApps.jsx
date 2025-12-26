import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../Components/User';
import Storyboard from '../Story/StoryBoard';
import '../Css/AIApps.css';

const AIApps = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isStoryboardOpen, setIsStoryboardOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    const apps = [
        {
            id: 'character-gen',
            title: 'Character Generation',
            description: 'Create unique original characters with AI-powered generation. Design appearances, personalities, and bring your characters to life.',
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z" transform="scale(0.09)" />
                </svg>
            ),
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            action: () => navigate('/chargen'),
            features: ['AI-Powered Design', 'Custom Attributes', 'Save to Stories']
        },
        {
            id: 'story-canvas',
            title: 'Story Generator',
            description: 'Craft compelling narratives with AI assistance. Generate story ideas, develop plots, and create immersive storytelling experiences.',
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M430.1 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 12-36.6.1-47.7zM120 216c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm40 126c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64-161c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm72 219c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm24-208c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" transform="scale(0.035)" />
                </svg>
            ),
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            action: () => setIsStoryboardOpen(true),
            features: ['AI Story Ideas', 'Plot Development', 'Creative Canvas']
        }
    ];

    return (
        <div className="ai-apps-page">
            {/* Header */}
            <header className="ai-apps-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>
                    <div className="logo">
                        <span className="logo-text">Ramen</span>
                        <span className="logo-art">Art</span>
                    </div>
                </div>
                <div className="header-right">
                    <User userData={userData} />
                </div>
            </header>

            {/* Hero Section */}
            <section className="ai-apps-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="title-gradient">AI-Powered</span> Creative Tools
                    </h1>
                    <p className="hero-subtitle">
                        Unleash your creativity with our suite of AI applications designed for storytellers and artists
                    </p>
                </div>
                <div className="hero-decoration">
                    <div className="floating-orb orb-1"></div>
                    <div className="floating-orb orb-2"></div>
                    <div className="floating-orb orb-3"></div>
                </div>
            </section>

            {/* Apps Grid */}
            <section className="apps-section">
                <div className="apps-grid">
                    {apps.map((app) => (
                        <div key={app.id} className="app-card" onClick={app.action}>
                            <div className="card-glow" style={{ background: app.gradient }}></div>
                            <div className="card-content">
                                <div className="card-icon" style={{ background: app.gradient }}>
                                    {app.icon}
                                </div>
                                <h2 className="card-title">{app.title}</h2>
                                <p className="card-description">{app.description}</p>
                                <div className="card-features">
                                    {app.features.map((feature, index) => (
                                        <span key={index} className="feature-tag">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <button className="launch-btn">
                                    <span>Launch App</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Storyboard Modal */}
            {isStoryboardOpen && (
                <Storyboard onClose={() => setIsStoryboardOpen(false)} />
            )}
        </div>
    );
};

export default AIApps;
