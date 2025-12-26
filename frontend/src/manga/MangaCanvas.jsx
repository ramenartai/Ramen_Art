import React from 'react';
import './css/MangaCanvas.css';

const MangaCanvas = ({ activePanelLayout, panels, onPanelToggle, onAddPanel, activePanelId, onPanelSelect }) => {
    return (
        <main className="center-area">
            {/* Pages Section */}
            <div className="pages-section">
                <div className="pages-header">
                    <h3>Pages</h3>
                    <button className="add-page-btn" onClick={onAddPanel}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Page
                    </button>
                </div>
                <div className="pages-list">
                    <div className="page-item active">
                        <div className="page-number">1</div>
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="canvas-area">
                {activePanelLayout ? (
                    <>
                        <div className="manga-canvas">
                            <svg
                                className="panel-layout-svg"
                                viewBox="0 0 100 140"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <rect width="100" height="140" fill="#0f1419" />
                                {activePanelLayout.panels.map((panel, idx) => (
                                    <rect
                                        key={panel.id || idx}
                                        x={panel.x}
                                        y={panel.y}
                                        width={panel.width}
                                        height={panel.height}
                                        rx="4"
                                        className={`panel-rect ${activePanelId === panel.id ? 'active' : ''}`}
                                        onClick={() => onPanelSelect(panel.id)}
                                    />
                                ))}
                            </svg>
                        </div>
                    </>
                ) : (
                    <div className="canvas-placeholder">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="9" y1="3" x2="9" y2="21" />
                            <line x1="15" y1="3" x2="15" y2="21" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="3" y1="15" x2="21" y2="15" />
                        </svg>
                        <p>Your manga panels will appear here</p>
                        <p className="canvas-hint">Select a panel template to begin</p>
                    </div>
                )}
            </div>

            {/* Layers Section */}
            <div className="layers-section">
                <h3 className="layers-title">Layers</h3>
                <div className="layers-list">
                    {panels.map((panel) => (
                        <div key={panel.id} className="layer-item">
                            <button
                                className="visibility-btn"
                                onClick={() => onPanelToggle(panel.id)}
                            >
                                {panel.visible ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                )}
                            </button>
                            <svg className="layer-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="3" width="7" height="7" />
                            </svg>
                            <span className="layer-name">{panel.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default MangaCanvas;
