import React, { useState, useEffect } from 'react';
import './css/MangaHeader.css';
import User from '../Components/User';

const MangaHeader = ({ onBack, userData, isPinned, onPinToggle }) => {
    return (
        <header className="manga-header">
            <div className="header-left">
                <button className="back-btn" onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>
                <div className="logo">
                    <span className="logo-text">Manga</span>
                    <span className="logo-art">Creator</span>
                </div>
            </div>
            <div className="header-right">
                <button className="export-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V3" />
                    </svg>
                    Export
                </button>
                <User userData={userData} />
                <button
                    className="pin-btn"
                    onClick={onPinToggle}
                    title={isPinned ? 'Unpin' : 'Pin'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
                    </svg>
                </button>

            </div>
        </header>
    );
};

export default MangaHeader;
