import React from 'react';
import './css/LeftSidebar.css';

const LeftSidebar = ({
    stories,
    selectedStory,
    onStorySelect,
    characters,
    selectedCharacters,
    onCharacterToggle,
    panelTemplates,
    selectedTemplate,
    onTemplateSelect,
    onAcceptTemplate
}) => {
    return (
        <aside className="left-sidebar">
            {/* Story Selection */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Story Selection</h3>
                <select
                    className="story-select"
                    value={selectedStory}
                    onChange={(e) => onStorySelect(e.target.value)}
                >
                    <option value="">Select a story...</option>
                    {stories.map((story) => (
                        <option key={story.id} value={story.id}>
                            {story.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Import Characters */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Import Characters</h3>
                <div className="characters-list">
                    {characters.length === 0 ? (
                        <p className="empty-message">
                            {selectedStory ? 'No characters found' : 'Select a story first'}
                        </p>
                    ) : (
                        characters.map((character) => (
                            <div
                                key={character.id}
                                className={`character-item ${selectedCharacters.includes(character.id) ? 'selected' : ''}`}
                                onClick={() => onCharacterToggle(character.id)}
                            >
                                <div className="character-avatar">
                                    {character.image_url ? (
                                        <img src={character.image_url} alt={character.character_name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {character.character_name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="character-name">{character.character_name}</span>
                                {selectedCharacters.includes(character.id) && (
                                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Panel Template Selector */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Choose a Panel Template</h3>
                <div className="template-grid">
                    {panelTemplates.map((template) => (
                        <div
                            key={template.id}
                            className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                            onClick={() => onTemplateSelect(template)}
                        >
                            <svg width="100" height="140" viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeWidth="1.5">
                                {template.svg}
                            </svg>
                        </div>
                    ))}
                </div>
                <button
                    className="accept-template-btn"
                    onClick={onAcceptTemplate}
                    disabled={!selectedTemplate}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Accept
                </button>
            </div>
        </aside>
    );
};

export default LeftSidebar;
