import React from 'react';
import './css/PanelSidebar.css';

const PanelSidebar = ({
    pages,
    activePageId,
    onPageSelect,
    onAddPage,
    onDeletePage,
    panelTemplates,
    selectedTemplate,
    onTemplateSelect,
    onAcceptTemplate
}) => {
    return (
        <aside className="panel-sidebar">
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

export default PanelSidebar;
