import React from 'react';
import './css/LeftSidebar.css';

const LeftSidebar = ({
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
    onCharacterToggle,
    panelTemplates,
    selectedTemplate,
    onTemplateSelect,
    onAcceptTemplate,
    // New props for Pages
    pages,
    activePageId,
    onPageSelect,
    onAddPage,
    onDeletePage
}) => {
    return (
        <aside className="left-sidebar">
            {/* Pages Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Pages</h3>
                <div className="pages-grid">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className={`page-card ${activePageId === page.id ? 'active' : ''}`}
                            onClick={() => onPageSelect(page.id)}
                        >
                            <div className="page-card-number">{page.id}</div>
                            {pages.length > 1 && (
                                <button
                                    className="delete-page-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeletePage(page.id);
                                    }}
                                    title="Delete page"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="add-page-card" onClick={onAddPage}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Add Page</span>
                    </button>
                </div>
            </div>

            {/* Layers Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Layers</h3>
                <div className="layers-list-sidebar">
                    <div className="layer-item-sidebar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Panel</span>
                    </div>
                    <div className="layer-item-sidebar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Panel</span>
                    </div>
                </div>
            </div>

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
                                {template.panels.map((panel, idx) => (
                                    <rect
                                        key={idx}
                                        x={panel.x}
                                        y={panel.y}
                                        width={panel.width}
                                        height={panel.height}
                                        rx="4"
                                    />
                                ))}
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
