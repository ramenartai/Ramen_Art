import React, { useRef } from 'react';
import './css/MangaCanvas.css';
import CanvasToolbar from './CanvasToolbar';
import CanvasElements from './CanvasElements';

const MangaCanvas = ({
    activePanelLayout,
    activePanelId,
    onPanelSelect,
    activeTool,
    onToolChange,
    canvasElements,
    onElementsChange,
    selectedElement,
    onSelectElement,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    panelImages = []
}) => {
    const canvasRef = useRef(null);

    // Helper to get image URL for a panel
    const getPanelImage = (panelId) => {
        const panel = panelImages.find(p => p.id === panelId);
        return panel?.imageUrl;
    };

    return (
        <main className="center-area">
            {/* Canvas Area */}
            <div className="canvas-area-full" ref={canvasRef}>
                {activePanelLayout ? (
                    <>
                        <div className="manga-canvas">
                            <svg
                                className="panel-layout-svg"
                                viewBox="0 0 100 140"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {/* Define clip paths for each panel */}
                                <defs>
                                    {activePanelLayout.panels.map((panel, idx) => (
                                        <clipPath key={`clip-${panel.id || idx}`} id={`panel-clip-${panel.id || idx}`}>
                                            <rect
                                                x={panel.x}
                                                y={panel.y}
                                                width={panel.width}
                                                height={panel.height}
                                            />
                                        </clipPath>
                                    ))}
                                </defs>

                                {activePanelLayout.panels.map((panel, idx) => {
                                    const imageUrl = getPanelImage(panel.id);
                                    return (
                                        <g key={panel.id || idx}>
                                            {/* Panel background rect */}
                                            <rect
                                                x={panel.x}
                                                y={panel.y}
                                                width={panel.width}
                                                height={panel.height}
                                                className={`panel-rect ${activePanelId === panel.id ? 'active' : ''}`}
                                                onClick={() => onPanelSelect(panel.id)}
                                            />

                                            {/* Panel image if available */}
                                            {imageUrl && (
                                                <image
                                                    href={imageUrl}
                                                    x={panel.x}
                                                    y={panel.y}
                                                    width={panel.width}
                                                    height={panel.height}
                                                    preserveAspectRatio="xMidYMid slice"
                                                    clipPath={`url(#panel-clip-${panel.id || idx})`}
                                                    onClick={() => onPanelSelect(panel.id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Canvas Elements Overlay */}
                            <CanvasElements
                                elements={canvasElements}
                                onElementsChange={onElementsChange}
                                activeTool={activeTool}
                                selectedElement={selectedElement}
                                onSelectElement={onSelectElement}
                                canvasRef={canvasRef}
                            />
                        </div>

                        {/* Canvas Toolbar */}
                        <CanvasToolbar
                            activeTool={activeTool}
                            onToolChange={onToolChange}
                            onUndo={onUndo}
                            onRedo={onRedo}
                            canUndo={canUndo}
                            canRedo={canRedo}
                        />
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
        </main>
    );
};

export default MangaCanvas;

