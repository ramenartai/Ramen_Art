import React from 'react';
import './css/RightSidebar.css';

const RightSidebar = ({
    prompt,
    onPromptChange,
    isRefining,
    onRefinePrompt,
    onResetPanels
}) => {
    return (
        <aside className="right-sidebar">
            <div className="chat-header">
                <h3>Story Prompt</h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                </svg>
            </div>

            <div className="chat-content">
                <div className="prompt-section">
                    <label className="prompt-label">Scene Description</label>
                    <textarea
                        className="prompt-textarea"
                        placeholder="Describe the manga scene... (e.g., 'A warrior stands on a cliff overlooking a vast battlefield at sunset')"
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        rows="4"
                    />
                    <button
                        className="refine-prompt-btn"
                        onClick={onRefinePrompt}
                        disabled={isRefining || !prompt.trim()}
                    >
                        {isRefining ? (
                            <>
                                <svg className="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Refining...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Refine with AI
                            </>
                        )}
                    </button>
                </div>

                <div className="settings-section">
                    <div className="setting-item">
                        <label>Continue from Previous</label>
                        <div className="toggle-switch">
                            <input type="checkbox" id="continue-toggle" />
                            <label htmlFor="continue-toggle"></label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Page Generation</label>
                        <div className="preset-selector">
                            <div className="preset-avatar"></div>
                            <span>Manga Style (Dev)</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Use Model Settings</label>
                        <div className="toggle-switch">
                            <input type="checkbox" id="model-toggle" />
                            <label htmlFor="model-toggle"></label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Panel Arrangement</label>
                        <button className="reset-btn" onClick={onResetPanels}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                <path d="M3 21v-5h5" />
                            </svg>
                            Reset Panels
                        </button>
                    </div>
                </div>

                <button className="generate-btn" disabled>
                    <span>Generate Page</span>
                    <span className="page-number-badge">#80</span>
                </button>
            </div>
        </aside>
    );
};

export default RightSidebar;
