import React, { useState } from 'react';
import './css/CanvasToolbar.css';

const CanvasToolbar = ({ activeTool, onToolChange, onUndo, onRedo, canUndo, canRedo }) => {
    const [showShapesMenu, setShowShapesMenu] = useState(false);

    const tools = [
        { id: 'select', icon: 'cursor', label: 'Select' },
        { id: 'text', icon: 'text', label: 'Text' },
        { id: 'shapes', icon: 'shapes', label: 'Shapes', hasMenu: true },
        { id: 'bubble', icon: 'bubble', label: 'Dialog Bubble' },
        { id: 'draw', icon: 'pen', label: 'Draw' },
    ];

    const shapes = [
        { id: 'rectangle', label: 'Rectangle' },
        { id: 'circle', label: 'Circle' },
        { id: 'triangle', label: 'Triangle' },
        { id: 'star', label: 'Star' },
    ];

    const actions = [
        { id: 'undo', icon: 'undo', label: 'Undo', disabled: !canUndo },
        { id: 'redo', icon: 'redo', label: 'Redo', disabled: !canRedo },
        { id: 'pan', icon: 'hand', label: 'Pan' },
    ];

    const renderIcon = (iconType) => {
        const icons = {
            cursor: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                </svg>
            ),
            text: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
            ),
            shapes: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
            bubble: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            image: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            ),
            pen: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                </svg>
            ),
            undo: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
                </svg>
            ),
            redo: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
                </svg>
            ),
            hand: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 11V6a2 2 0 00-4 0v5" />
                    <path d="M14 10V4a2 2 0 00-4 0v2" />
                    <path d="M10 10.5V6a2 2 0 00-4 0v8" />
                    <path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15" />
                </svg>
            ),
        };
        return icons[iconType] || null;
    };

    const handleToolClick = (toolId) => {
        if (toolId === 'shapes') {
            setShowShapesMenu(!showShapesMenu);
        } else {
            onToolChange(toolId);
            setShowShapesMenu(false);
        }
    };

    const handleActionClick = (actionId) => {
        if (actionId === 'undo' && canUndo) {
            onUndo();
        } else if (actionId === 'redo' && canRedo) {
            onRedo();
        } else {
            onToolChange(actionId);
        }
    };

    return (
        <div className="canvas-toolbar">
            <div className="toolbar-section toolbar-main">
                <button className="toolbar-action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </button>
            </div>

            <div className="toolbar-section toolbar-tools">
                {tools.map((tool) => (
                    <div key={tool.id} className="toolbar-tool-wrapper">
                        <button
                            className={`toolbar-btn ${activeTool === tool.id || (tool.hasMenu && showShapesMenu) ? 'active' : ''}`}
                            onClick={() => handleToolClick(tool.id)}
                            title={tool.label}
                        >
                            {renderIcon(tool.icon)}
                        </button>
                        {tool.hasMenu && showShapesMenu && (
                            <div className="shapes-dropdown">
                                {shapes.map((shape) => (
                                    <button
                                        key={shape.id}
                                        className="shape-option"
                                        onClick={() => {
                                            onToolChange(shape.id);
                                            setShowShapesMenu(false);
                                        }}
                                    >
                                        {shape.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="toolbar-section toolbar-actions">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        className={`toolbar-btn ${action.disabled ? 'disabled' : ''}`}
                        onClick={() => handleActionClick(action.id)}
                        title={action.label}
                        disabled={action.disabled}
                    >
                        {renderIcon(action.icon)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CanvasToolbar;
