import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import './css/CanvasElements.css';

const CanvasElements = ({
    elements,
    onElementsChange,
    activeTool,
    selectedElement,
    onSelectElement,
    canvasRef
}) => {
    const [editingElement, setEditingElement] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createStart, setCreateStart] = useState(null);
    const [createPreview, setCreatePreview] = useState(null);

    const handleCanvasMouseDown = (e) => {
        // Only handle if we're in a creation tool mode
        if (activeTool === 'select' || activeTool === 'pan') return;
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsCreating(true);
        setCreateStart({ x, y });
        setCreatePreview({ x, y, width: 0, height: 0, type: activeTool });
    };

    const handleCanvasMouseMove = (e) => {
        if (!isCreating || !createStart || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = Math.abs(currentX - createStart.x);
        const height = Math.abs(currentY - createStart.y);
        const x = Math.min(currentX, createStart.x);
        const y = Math.min(currentY, createStart.y);

        setCreatePreview({ x, y, width, height, type: activeTool });
    };

    const handleCanvasMouseUp = (e) => {
        if (!isCreating || !createPreview || !canvasRef.current) return;

        const minSize = 30; // Minimum size to create an element

        if (createPreview.width > minSize && createPreview.height > minSize) {
            // Create the element based on the tool
            if (activeTool === 'text') {
                addTextElement(createPreview.x, createPreview.y, createPreview.width, createPreview.height);
            } else if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'triangle' || activeTool === 'star') {
                addShapeElement(createPreview.x, createPreview.y, createPreview.width, createPreview.height, activeTool);
            } else if (activeTool === 'bubble') {
                addBubbleElement(createPreview.x, createPreview.y, createPreview.width, createPreview.height);
            }
        }

        setIsCreating(false);
        setCreateStart(null);
        setCreatePreview(null);
    };

    const addTextElement = (x, y, width, height) => {
        const newElement = {
            id: Date.now(),
            type: 'text',
            x,
            y,
            width,
            height,
            content: 'Add text',
            fontSize: 16,
            color: '#ffffff',
            fontWeight: 'normal',
            textAlign: 'left'
        };
        onElementsChange([...elements, newElement]);
        onSelectElement(newElement.id);
        // Auto-enter edit mode
        setTimeout(() => setEditingElement(newElement.id), 100);
    };

    const addShapeElement = (x, y, width, height, shapeType = 'rectangle') => {
        const newElement = {
            id: Date.now(),
            type: 'shape',
            shapeType,
            x,
            y,
            width,
            height,
            fill: '#667eea',
            stroke: '#ffffff',
            strokeWidth: 2
        };
        onElementsChange([...elements, newElement]);
        onSelectElement(newElement.id);
    };

    const addBubbleElement = (x, y, width, height) => {
        const newElement = {
            id: Date.now(),
            type: 'bubble',
            bubbleStyle: 'speech',
            x,
            y,
            width,
            height,
            content: 'Text here',
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2
        };
        onElementsChange([...elements, newElement]);
        onSelectElement(newElement.id);
    };

    const handleTextEdit = (elementId, newContent) => {
        const updatedElements = elements.map(el =>
            el.id === elementId ? { ...el, content: newContent } : el
        );
        onElementsChange(updatedElements);
    };

    const deleteElement = (elementId) => {
        onElementsChange(elements.filter(el => el.id !== elementId));
        if (selectedElement === elementId) {
            onSelectElement(null);
        }
    };

    const renderElement = (element) => {
        const isSelected = selectedElement === element.id;

        if (element.type === 'text') {
            const isEditing = editingElement === element.id;

            return (
                <Rnd
                    key={element.id}
                    position={{ x: element.x, y: element.y }}
                    size={{ width: element.width, height: element.height }}
                    onDragStop={(e, d) => {
                        const updatedElements = elements.map(el =>
                            el.id === element.id ? { ...el, x: d.x, y: d.y } : el
                        );
                        onElementsChange(updatedElements);
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        const updatedElements = elements.map(el => {
                            if (el.id === element.id) {
                                return {
                                    ...el,
                                    width: ref.offsetWidth,
                                    height: ref.offsetHeight,
                                    x: position.x,
                                    y: position.y
                                };
                            }
                            return el;
                        });
                        onElementsChange(updatedElements);
                    }}
                    onClick={() => {
                        if (!isEditing) {
                            onSelectElement(element.id);
                        }
                    }}
                    className={`canvas-element text-element ${isSelected ? 'selected' : ''}`}
                    enableResizing={isSelected && !isEditing}
                    disableDragging={!isSelected || isEditing}
                >
                    <div
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingElement(element.id);
                            onSelectElement(element.id);
                        }}
                        onBlur={(e) => {
                            handleTextEdit(element.id, e.target.textContent);
                            setEditingElement(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.target.blur();
                            }
                        }}
                        style={{
                            fontSize: element.fontSize,
                            color: element.color,
                            fontWeight: element.fontWeight,
                            textAlign: element.textAlign,
                            width: '100%',
                            height: '100%',
                            outline: 'none',
                            cursor: isEditing ? 'text' : 'move',
                            padding: '8px',
                            userSelect: isEditing ? 'text' : 'none',
                            pointerEvents: isEditing ? 'auto' : 'none',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {element.content}
                    </div>
                    {isSelected && !isEditing && (
                        <button
                            className="delete-element-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(element.id);
                            }}
                        >
                            ×
                        </button>
                    )}
                </Rnd>
            );
        }

        if (element.type === 'shape') {
            return (
                <Rnd
                    key={element.id}
                    position={{ x: element.x, y: element.y }}
                    size={{ width: element.width, height: element.height }}
                    onDragStop={(e, d) => {
                        const updatedElements = elements.map(el =>
                            el.id === element.id ? { ...el, x: d.x, y: d.y } : el
                        );
                        onElementsChange(updatedElements);
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        const updatedElements = elements.map(el => {
                            if (el.id === element.id) {
                                return {
                                    ...el,
                                    width: ref.offsetWidth,
                                    height: ref.offsetHeight,
                                    x: position.x,
                                    y: position.y
                                };
                            }
                            return el;
                        });
                        onElementsChange(updatedElements);
                    }}
                    onClick={() => onSelectElement(element.id)}
                    className={`canvas-element shape-element ${isSelected ? 'selected' : ''}`}
                    enableResizing={isSelected}
                    disableDragging={!isSelected}
                    lockAspectRatio={element.shapeType === 'circle'}
                >
                    {renderShape(element)}
                    {isSelected && (
                        <button
                            className="delete-element-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(element.id);
                            }}
                        >
                            ×
                        </button>
                    )}
                </Rnd>
            );
        }

        if (element.type === 'bubble') {
            const isEditing = editingElement === element.id;

            return (
                <Rnd
                    key={element.id}
                    position={{ x: element.x, y: element.y }}
                    size={{ width: element.width, height: element.height }}
                    onDragStop={(e, d) => {
                        const updatedElements = elements.map(el =>
                            el.id === element.id ? { ...el, x: d.x, y: d.y } : el
                        );
                        onElementsChange(updatedElements);
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        const updatedElements = elements.map(el => {
                            if (el.id === element.id) {
                                return {
                                    ...el,
                                    width: ref.offsetWidth,
                                    height: ref.offsetHeight,
                                    x: position.x,
                                    y: position.y
                                };
                            }
                            return el;
                        });
                        onElementsChange(updatedElements);
                    }}
                    onClick={() => {
                        if (!isEditing) {
                            onSelectElement(element.id);
                        }
                    }}
                    className={`canvas-element bubble-element ${isSelected ? 'selected' : ''}`}
                    enableResizing={isSelected && !isEditing}
                    disableDragging={!isSelected || isEditing}
                >
                    <svg width="100%" height="100%" viewBox="0 0 150 100" preserveAspectRatio="none">
                        <path
                            d="M10,10 Q10,0 20,0 L130,0 Q140,0 140,10 L140,70 Q140,80 130,80 L80,80 L70,95 L65,80 L20,80 Q10,80 10,70 Z"
                            fill={element.fill}
                            stroke={element.stroke}
                            strokeWidth={element.strokeWidth}
                        />
                    </svg>
                    <div
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingElement(element.id);
                            onSelectElement(element.id);
                        }}
                        onBlur={(e) => {
                            handleTextEdit(element.id, e.target.textContent);
                            setEditingElement(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.target.blur();
                            }
                        }}
                        className="bubble-text"
                        style={{
                            position: 'absolute',
                            top: '15%',
                            left: '15%',
                            right: '15%',
                            bottom: '25%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#000',
                            outline: 'none',
                            cursor: isEditing ? 'text' : 'move',
                            overflow: 'hidden',
                            userSelect: isEditing ? 'text' : 'none',
                            pointerEvents: isEditing ? 'auto' : 'none'
                        }}
                    >
                        {element.content}
                    </div>
                    {isSelected && !isEditing && (
                        <button
                            className="delete-element-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(element.id);
                            }}
                        >
                            ×
                        </button>
                    )}
                </Rnd>
            );
        }

        return null;
    };

    const renderShape = (element) => {
        const { shapeType, fill, stroke, strokeWidth } = element;

        if (shapeType === 'rectangle') {
            return (
                <svg width="100%" height="100%">
                    <rect
                        width="100%"
                        height="100%"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        rx="4"
                    />
                </svg>
            );
        }

        if (shapeType === 'circle') {
            return (
                <svg width="100%" height="100%">
                    <ellipse
                        cx="50%"
                        cy="50%"
                        rx="45%"
                        ry="45%"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                    />
                </svg>
            );
        }

        if (shapeType === 'triangle') {
            return (
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon
                        points="50,10 90,90 10,90"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                    />
                </svg>
            );
        }

        if (shapeType === 'star') {
            return (
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon
                        points="50,5 61,35 92,35 67,55 78,85 50,65 22,85 33,55 8,35 39,35"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                    />
                </svg>
            );
        }

        return null;
    };

    // Render creation preview
    const renderCreationPreview = () => {
        if (!createPreview || createPreview.width === 0 || createPreview.height === 0) return null;

        return (
            <div
                style={{
                    position: 'absolute',
                    left: createPreview.x,
                    top: createPreview.y,
                    width: createPreview.width,
                    height: createPreview.height,
                    border: '2px dashed #667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    pointerEvents: 'none',
                    zIndex: 1000
                }}
            />
        );
    };

    return (
        <div
            className="canvas-elements-overlay"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            style={{
                pointerEvents: 'auto',
                cursor: (activeTool !== 'select' && activeTool !== 'pan') ? 'crosshair' : 'default'
            }}
        >
            {elements.map(renderElement)}
            {renderCreationPreview()}
        </div>
    );
};

export default CanvasElements;
