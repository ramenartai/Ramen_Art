import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../Components/User';
import Storyboard from '../Story/StoryBoard';
import '../Css/HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All Posts');
    const [userData, setUserData] = useState(null);
    const [isStoryboardOpen, setIsStoryboardOpen] = useState(false);
    const [isToolsSidebarOpen, setIsToolsSidebarOpen] = useState(false);

    useEffect(() => {
        // Fetch user data from localStorage or API
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    const filters = [
        'All Posts', 'Featured', 'Templates', 'Animation', 'Leaderboard',
        '#ComicChristmas', '#Hanabi', '#CC', 'Kawaii', 'Shiro', 'WaiAI', 'T'
    ];

    const galleryItems = [
        { id: 1, type: 'character', featured: true },
        { id: 2, type: 'scene', featured: false },
        { id: 3, type: 'character', featured: false },
        { id: 4, type: 'landscape', featured: true },
        { id: 5, type: 'celebration', featured: true },
    ];

    const handleExploreCharacters = () => {
        navigate('/chargen');
    };

    return (
        <div className="home-page">
            {/* Header */}
            <header className="home-header">
                <div className="logo">
                    <span className="logo-text">Ramen</span>
                    <span className="logo-art">Art</span>
                </div>
                <nav className="nav-menu">
                    <a href="#home" className="nav-item active">
                        <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.97 2.59a1.5 1.5 0 0 0-1.94 0l-7.5 6.363A1.5 1.5 0 0 0 3 10.097V19.5A1.5 1.5 0 0 0 4.5 21h4.75a.75.75 0 0 0 .75-.75V14h4v6.25c0 .414.336.75.75.75h4.75a1.5 1.5 0 0 0 1.5-1.5v-9.403a1.5 1.5 0 0 0-.53-1.144l-7.5-6.363Z" />
                        </svg>
                        Home
                    </a>
                    <a href="/ai-apps" className="nav-item">
                        <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z" transform="scale(0.04)" />
                        </svg>
                        AI-Apps
                    </a>
                    <a href="/profile" className="nav-item">
                        <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z" />
                        </svg>
                        Profile
                    </a>
                </nav>
                <div className="header-actions">
                    <User userData={userData} />
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    {/* AI Art Card */}
                    <div className="feature-card ai-art-card">
                        <div className="card-mascot left-mascot">
                            <div className="mascot-character orange-cat">
                                <div className="cat-head">
                                    <div className="cat-ears">
                                        <div className="ear left"></div>
                                        <div className="ear right"></div>
                                    </div>
                                    <div className="cat-face">
                                        <div className="eyes">
                                            <div className="eye"></div>
                                            <div className="eye"></div>
                                        </div>
                                        <div className="nose"></div>
                                        <div className="mouth"></div>
                                    </div>
                                </div>
                                <div className="cat-body">
                                    <div className="bow-tie"></div>
                                </div>
                            </div>
                        </div>

                        <div className="card-content">
                            <h2 className="card-title">AI Art</h2>
                            <div className="card-actions">
                                <button className="action-btn primary" onClick={handleExploreCharacters}>
                                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z" transform="scale(0.09)" />
                                    </svg>
                                    Explore Characters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Manga Creator Card */}
                    <div className="feature-card manga-card">
                        <div className="card-content">
                            <h2 className="card-title">Manga Creator</h2>
                            <div className="card-actions">
                                <button className="action-btn primary" onClick={() => navigate('/manga-creator')}>
                                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                    </svg>
                                    Create Manga
                                </button>
                                <button className="action-btn secondary" onClick={() => setIsStoryboardOpen(true)}>
                                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M430.1 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 12-36.6.1-47.7zM120 216c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm40 126c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64-161c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm72 219c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm24-208c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" transform="scale(0.035)" />
                                    </svg>
                                    Story Canvas
                                </button>
                            </div>
                        </div>
                        <div className="card-mascot right-mascot">
                            <div className="mascot-character manga-mascot">
                                <div className="manga-book">
                                    <div className="book-cover"></div>
                                    <div className="book-pages"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Info Banner */}
                <div className="info-banner">
                    <svg className="banner-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="banner-content">
                        <p className="banner-text">
                            <strong>AI APPS HUB</strong> - Your tools now live on the AI Apps page
                        </p>
                        <p className="banner-subtext">
                            Favorite your go-to tools and browse the complete catalog of AI apps for illustration, animation, comics, and more.
                        </p>
                    </div>
                    <button className="banner-btn">Open AI Apps</button>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="gallery-section">
                <div className="gallery-filters">
                    <div className="filter-left">
                        <button className="filter-btn">
                            <svg className="filter-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            Search
                        </button>
                        <button className="filter-btn">
                            <svg className="filter-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                            </svg>
                            Trending
                        </button>
                    </div>
                    <div className="filter-tags">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className={`filter-tag ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="gallery-grid">
                    {galleryItems.map((item) => (
                        <div key={item.id} className={`gallery-item ${item.featured ? 'featured' : ''}`}>
                            <div className="gallery-image">
                                <div className={`placeholder-image type-${item.type}`}>
                                    {item.featured && (
                                        <div className="featured-badge">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="gallery-info">
                                <div className="gallery-meta">
                                    <span className="gallery-likes">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                        {Math.floor(Math.random() * 1000)}
                                    </span>
                                    <span className="gallery-views">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        {Math.floor(Math.random() * 5000)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tools Sidebar Toggle Button */}
            <button
                className={`tools-toggle-btn ${isToolsSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsToolsSidebarOpen(!isToolsSidebarOpen)}
                title={isToolsSidebarOpen ? 'Close Tools' : 'Open Tools'}
            >
                {isToolsSidebarOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                    </svg>
                )}
            </button>

            {/* Tools Sidebar */}
            <aside className={`tools-sidebar ${isToolsSidebarOpen ? 'open' : ''}`}>
                <h3 className="sidebar-title">Tools</h3>
                <div className="tool-list">
                    <div className="tool-item" onClick={() => navigate('/chargen')}>
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z" transform="scale(0.07)" />
                        </svg>
                        <span className="tool-name">Character Generation</span>
                    </div>
                    <div className="tool-item" onClick={() => setIsStoryboardOpen(true)}>
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M430.1 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 12-36.6.1-47.7zM120 216c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm40 126c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64-161c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm72 219c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm24-208c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" transform="scale(0.035)" />
                        </svg>
                        <span className="tool-name">Story Generator</span>
                    </div>

                </div>
            </aside>

            {/* Storyboard Modal */}
            {isStoryboardOpen && (
                <Storyboard onClose={() => setIsStoryboardOpen(false)} />
            )}
        </div>
    );
};

export default HomePage;
