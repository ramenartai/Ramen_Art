import React from 'react';
import './css/SelectionSidebar.css';

const SelectionSidebar = ({
    stories,
    selectedStory,
    onStorySelect,
    arcs,
    selectedArc,
    onArcSelect,
    chapters,
    selectedChapter,
    onChapterSelect,
    characters,
    selectedCharacters,
    onCharacterToggle
}) => {
    return (
        <aside className="selection-sidebar">
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

            {/* Arc Selection */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Select Arc</h3>
                <select
                    className="story-select"
                    value={selectedArc}
                    onChange={(e) => onArcSelect(e.target.value)}
                    disabled={!selectedStory}
                >
                    <option value="">Select an arc...</option>
                    {arcs.map((arc) => (
                        <option key={arc.arc_id} value={arc.arc_id}>
                            {arc.arc_title}
                        </option>
                    ))}
                </select>
                {selectedArc && arcs.find(a => a.arc_id === selectedArc) && (
                    <p className="arc-summary">
                        {arcs.find(a => a.arc_id === selectedArc).arc_summary}
                    </p>
                )}
            </div>

            {/* Chapter Selection */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Select Chapter</h3>
                <select
                    className="story-select"
                    value={selectedChapter}
                    onChange={(e) => onChapterSelect(e.target.value)}
                    disabled={!selectedArc}
                >
                    <option value="">Select a chapter...</option>
                    {chapters.map((chapter) => (
                        <option key={chapter.chapter_id} value={chapter.chapter_id}>
                            {chapter.chapter_title}
                        </option>
                    ))}
                </select>
                {selectedChapter && chapters.find(c => c.chapter_id === selectedChapter) && (
                    <p className="arc-summary">
                        <strong>Purpose:</strong> {chapters.find(c => c.chapter_id === selectedChapter).chapter_purpose}
                    </p>
                )}
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
        </aside>
    );
};

export default SelectionSidebar;
