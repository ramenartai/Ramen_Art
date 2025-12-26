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

    const handleGenerateImage = () => {
        console.log('AI Art Generator - Coming soon');
    };

    const handleGenerateVideo = () => {
        console.log('Video Creator - Coming soon');
    };

    const handleGenerate = () => {
        console.log('Generate - Coming soon');
    };

    const handleCreateComic = () => {
        console.log('AI Comic Generator - Coming soon');
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
                    <a href="#templates" className="nav-item">
                        <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" />
                            <path d="M4 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                            <path d="M14 12l6 0" /><path d="M14 16l6 0" /><path d="M14 20l6 0" />
                        </svg>
                        Templates
                    </a>
                    <a href="#post" className="nav-item">
                        <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Post
                    </a>
                    <a href="#ai-apps" className="nav-item">
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
                                <button className="action-btn secondary" onClick={handleGenerateImage}>
                                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                    Generate Image
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Storytelling Card */}
                    <div className="feature-card storytelling-card">
                        <div className="card-content">
                            <h2 className="card-title">Storytelling</h2>
                            <div className="card-actions">
                                <button className="action-btn primary" onClick={handleGenerateVideo}>
                                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                                        <rect x="2" y="6" width="14" height="12" rx="2" />
                                    </svg>
                                    Generate Video
                                </button>
                                <div className="action-group">
                                    <button className="action-btn secondary small" onClick={handleGenerate}>
                                        <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                                        </svg>
                                        Generate
                                    </button>
                                    <button className="action-btn accent small" onClick={handleCreateComic}>
                                        <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                        </svg>
                                        Create Comic
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card-mascot right-mascot">
                            <div className="mascot-character brown-dog">
                                <div className="dog-head">
                                    <div className="dog-ears">
                                        <div className="ear left"></div>
                                        <div className="ear right"></div>
                                    </div>
                                    <div className="dog-face">
                                        <div className="sunglasses">
                                            <div className="lens"></div>
                                            <div className="lens"></div>
                                            <div className="bridge"></div>
                                        </div>
                                        <div className="snout">
                                            <div className="nose"></div>
                                            <div className="mouth"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dog-body">
                                    <div className="hoodie"></div>
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

            {/* Tools Sidebar */}
            <aside className="tools-sidebar">
                <h3 className="sidebar-title">Tools</h3>
                <div className="tool-list">
                    <div className="tool-item" onClick={() => navigate('/chargen')}>
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z" transform="scale(0.07)" />
                        </svg>
                        <span className="tool-name">OC Maker</span>
                    </div>
                    <div className="tool-item" onClick={() => setIsStoryboardOpen(true)}>
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M430.1 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 12-36.6.1-47.7zM120 216c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm40 126c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64-161c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm72 219c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm24-208c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" transform="scale(0.035)" />
                        </svg>
                        <span className="tool-name">AI Art Generator</span>
                    </div>
                    <div className="tool-item">
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                        <span className="tool-name">Image Playground</span>
                    </div>
                    <div className="tool-item">
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 8h.01" />
                            <path d="M11 20h-4a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v4" />
                            <path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l3 3" />
                            <path d="M14 14l1 -1c.31 -.298 .644 -.497 .987 -.596" />
                            <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                        </svg>
                        <span className="tool-name">Line Art Colorization</span>
                    </div>
                    <div className="tool-item">
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10.0357 7.69802C8.38492 9.55932 6.5134 12.2442 4.89465 15.4817C4.64766 15.9757 4.04698 16.1759 3.55301 15.9289C3.05903 15.6819 2.8588 15.0812 3.10579 14.5873C4.79739 11.2041 6.76494 8.37171 8.53943 6.37095C9.4251 5.37234 10.2797 4.56162 11.0449 3.99131C11.4272 3.7063 11.8049 3.46806 12.1677 3.29756C12.5193 3.13234 12.921 3 13.3336 3C13.5496 3 13.7872 3.0535 14.007 3.19476C14.2233 3.33371 14.3629 3.51925 14.4495 3.69083C14.6066 4.00215 14.624 4.33473 14.6201 4.55938C14.6118 5.03651 14.4847 5.6328 14.3216 6.23975C13.9874 7.48318 13.3994 9.13104 12.8149 10.7577L12.7329 10.9858C12.1671 12.5598 11.6101 14.1093 11.248 15.3466C11.1505 15.68 11.0706 15.9792 11.0094 16.2414C11.7035 15.6835 12.5581 14.8454 13.466 13.9534L13.4956 13.9243C14.3772 13.0581 15.3098 12.1418 16.0967 11.5127C16.4872 11.2006 16.9082 10.904 17.3138 10.7322C17.6544 10.5878 18.4343 10.3532 19.0407 10.9596C19.4251 11.344 19.5318 11.8438 19.5594 12.2164C19.5883 12.6064 19.5429 13.0267 19.4725 13.4261C19.3315 14.2258 19.0483 15.159 18.7894 16.0009L18.7478 16.136C18.5165 16.8874 18.3102 17.5577 18.1926 18.0965C18.4529 17.8352 18.7734 17.4216 19.1475 16.811C19.436 16.34 20.0517 16.1921 20.5226 16.4806C20.9935 16.7691 21.1414 17.3848 20.8529 17.8557C20.3099 18.7422 19.748 19.4622 19.1519 19.9092C18.5283 20.377 17.7121 20.6407 16.8863 20.2278C16.2779 19.9235 16.1398 19.3173 16.1091 18.9819C16.0759 18.6192 16.1284 18.2233 16.1979 17.8667C16.3288 17.1944 16.5829 16.3698 16.823 15.5907L16.8777 15.4129C17.1447 14.5451 17.3873 13.734 17.5028 13.0789C17.5117 13.0284 17.5196 12.9802 17.5266 12.9341C17.4697 12.977 17.4094 13.0239 17.3455 13.0749C16.6477 13.6328 15.785 14.4788 14.8677 15.38L14.8381 15.4091C13.9566 16.2752 13.024 17.1915 12.2371 17.8206C11.8466 18.1328 11.4255 18.4293 11.02 18.6012C10.6794 18.7455 9.89947 18.9801 9.29311 18.3738C8.9843 18.065 8.9052 17.6753 8.87972 17.4382C8.8515 17.1755 8.86901 16.8971 8.90269 16.6351C8.9706 16.1069 9.12934 15.4656 9.32855 14.7849C9.70829 13.4872 10.2842 11.8852 10.8411 10.3362L10.9327 10.0814C11.5263 8.42931 12.082 6.8674 12.3901 5.72074C12.4172 5.61968 12.4418 5.52435 12.4638 5.43468C12.3924 5.48361 12.3178 5.53695 12.2401 5.59489C11.6173 6.05907 10.8627 6.76559 10.0357 7.69802Z" />
                        </svg>
                        <span className="tool-name">Sketch Simplification</span>
                    </div>
                    <div className="tool-item">
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.5 15.584V8.416a.5.5 0 0 1 .77-.42l5.576 3.583a.5.5 0 0 1 0 .842l-5.576 3.584a.5.5 0 0 1-.77-.42Z" />
                            <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm11-9.5A9.5 9.5 0 0 0 2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5Z" />
                        </svg>
                        <span className="tool-name">AI Animation Generator</span>
                    </div>
                    <div className="tool-item">
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                            <rect x="2" y="6" width="14" height="12" rx="2" />
                        </svg>
                        <span className="tool-name">Video to Video</span>
                    </div>
                    <div className="tool-item">
                        <svg className="tool-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                        </svg>
                        <span className="tool-name">AI Comic Generator</span>
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
