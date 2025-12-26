import React from 'react';
import './css/RightSidebar.css';

const RightSidebar = ({
    prompt,
    onPromptChange,
    isRefining,
    onRefinePrompt,
    onResetPanels,
    activePanelId,
    selectedCharacters,
    characters,
    panelPrompts,
    setPanelPrompts,
    panelCharacters,
    setPanelCharacters
}) => {
    // Helper to get selected character objects
    const availableCharacters = characters.filter(c => selectedCharacters.includes(c.id));

    const handlePanelPromptChange = (e) => {
        setPanelPrompts(prev => ({
            ...prev,
            [activePanelId]: e.target.value
        }));
    };

    const handlePanelCharacterToggle = (charId) => {
        setPanelCharacters(prev => {
            const current = prev[activePanelId] || [];
            const updated = current.includes(charId)
                ? current.filter(id => id !== charId)
                : [...current, charId];
            return {
                ...prev,
                [activePanelId]: updated
            };
        });
    };

    if (activePanelId) {
        return (
            <aside className="right-sidebar panel-mode">
                <div className="chat-header">
                    <h3>Panel Configuration</h3>
                    <div className="panel-badge">Panel {activePanelId}</div>
                </div>

                <div className="chat-content">
                    {/* Panel Scence Description */}
                    <div className="prompt-section">
                        <label className="prompt-label">Panel Action</label>
                        <textarea
                            className="prompt-textarea"
                            placeholder="Describe what happens in this specific panel... (e.g. 'Close up of Hero eyes widening in shock')"
                            value={panelPrompts[activePanelId] || ''}
                            onChange={handlePanelPromptChange}
                            rows="4"
                        />
                        <button className="refine-prompt-btn" disabled>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            Suggest Action
                        </button>
                    </div>

                    {/* Character Selector for Panel */}
                    <div className="settings-section">
                        <label className="prompt-label">Characters in Panel</label>
                        <div className="panel-chars-list">
                            {availableCharacters.length === 0 ? (
                                <p className="empty-message">No characters selected in story</p>
                            ) : (
                                availableCharacters.map(char => (
                                    <div
                                        key={char.id}
                                        className={`panel-char-item ${(panelCharacters[activePanelId] || []).includes(char.id) ? 'selected' : ''}`}
                                        onClick={() => handlePanelCharacterToggle(char.id)}
                                    >
                                        <div className="panel-char-avatar">
                                            {char.image_url ? (
                                                <img src={char.image_url} alt={char.character_name} />
                                            ) : (
                                                <span>{char.character_name[0]}</span>
                                            )}
                                        </div>
                                        <span>{char.character_name}</span>
                                        {(panelCharacters[activePanelId] || []).includes(char.id) && (
                                            <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <button className="generate-btn">
                        <span>Generate Panel</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </button>
                </div>
            </aside>
        );
    }

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
