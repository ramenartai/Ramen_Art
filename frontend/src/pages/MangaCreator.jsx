import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import refinePrompt from '../utils/aiOptimize';
import MangaHeader from '../manga/MangaHeader';
import SelectionSidebar from '../manga/SelectionSidebar';
import PanelSidebar from '../manga/PanelSidebar';
import MangaCanvas from '../manga/MangaCanvas';
import RightSidebar from '../manga/RightSidebar';
import '../Css/MangaCreator.css';

const MangaCreator = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [arcs, setArcs] = useState([]);
    const [selectedArc, setSelectedArc] = useState('');
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [characters, setCharacters] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    // --- Page State ---
    const [pages, setPages] = useState([
        { id: 1, panels: [] }
    ]);
    const [activePageId, setActivePageId] = useState(1);

    const [prompt, setPrompt] = useState('');
    const [refinedStoryText, setRefinedStoryText] = useState(''); // Stores AI-refined story text
    const [isRefining, setIsRefining] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isPinned, setIsPinned] = useState(false);
    const [activePanelLayout, setActivePanelLayout] = useState(null);
    const [activePanelId, setActivePanelId] = useState(null);
    const [panelPrompts, setPanelPrompts] = useState({});
    const [panelCharacters, setPanelCharacters] = useState({});
    const [activeTool, setActiveTool] = useState('select');
    const [selectedElement, setSelectedElement] = useState(null);
    const [history, setHistory] = useState({ past: [], present: [], future: [] });

    // --- Resizable Sidebar State ---
    const [selectionWidth, setSelectionWidth] = useState(260);
    const [panelWidth, setPanelWidth] = useState(260);
    const [promptWidth, setPromptWidth] = useState(300);
    const [isDragging, setIsDragging] = useState(null); // 'selection', 'panel', or 'prompt'

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            if (isDragging === 'selection') {
                const newWidth = Math.max(150, Math.min(450, e.clientX));
                setSelectionWidth(newWidth);
            } else if (isDragging === 'panel') {
                const newWidth = Math.max(150, Math.min(450, e.clientX - selectionWidth));
                setPanelWidth(newWidth);
            } else if (isDragging === 'prompt') {
                const newWidth = Math.max(200, Math.min(500, window.innerWidth - e.clientX));
                setPromptWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(null);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, selectionWidth]);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const panelTemplates = [
        {
            id: 1,
            layout: 'single',
            panels: [{ id: 'p1', x: 10, y: 10, width: 80, height: 120 }]
        },
        {
            id: 2,
            layout: 'horizontal-3',
            panels: [
                { id: 'p1', x: 10, y: 10, width: 80, height: 35 },
                { id: 'p2', x: 10, y: 50, width: 80, height: 35 },
                { id: 'p3', x: 10, y: 90, width: 80, height: 40 }
            ]
        },
        {
            id: 3,
            layout: 'grid-4',
            panels: [
                { id: 'p1', x: 10, y: 10, width: 38, height: 58 },
                { id: 'p2', x: 52, y: 10, width: 38, height: 58 },
                { id: 'p3', x: 10, y: 72, width: 38, height: 58 },
                { id: 'p4', x: 52, y: 72, width: 38, height: 58 }
            ]
        },
        {
            id: 4,
            layout: 'vertical-split',
            panels: [
                { id: 'p1', x: 10, y: 10, width: 38, height: 40 },
                { id: 'p2', x: 52, y: 10, width: 38, height: 40 },
                { id: 'p3', x: 10, y: 55, width: 80, height: 35 },
                { id: 'p4', x: 10, y: 95, width: 80, height: 35 }
            ]
        },
        {
            id: 5,
            layout: 'horizontal-split',
            panels: [
                { id: 'p1', x: 10, y: 10, width: 80, height: 35 },
                { id: 'p2', x: 10, y: 50, width: 80, height: 35 },
                { id: 'p3', x: 10, y: 90, width: 38, height: 40 },
                { id: 'p4', x: 52, y: 90, width: 38, height: 40 }
            ]
        },
        {
            id: 6,
            layout: 'l-shape',
            panels: [
                { id: 'p1', x: 10, y: 10, width: 38, height: 40 },
                { id: 'p2', x: 52, y: 10, width: 38, height: 40 },
                { id: 'p3', x: 10, y: 55, width: 80, height: 35 },
                { id: 'p4', x: 10, y: 95, width: 38, height: 35 },
                { id: 'p5', x: 52, y: 95, width: 38, height: 35 }
            ]
        },
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }

        const savedPages = localStorage.getItem('mangaPages');
        if (savedPages) {
            try {
                const parsedPages = JSON.parse(savedPages);
                if (Array.isArray(parsedPages) && parsedPages.length > 0) {
                    setPages(parsedPages);
                    setActivePageId(parsedPages[0].id);
                }
            } catch (error) {
                console.error('Failed to load saved pages:', error);
            }
        }

        const savedLayoutId = localStorage.getItem('activePanelLayoutId');
        if (savedLayoutId) {
            try {
                const templateId = parseInt(savedLayoutId);
                const template = panelTemplates.find(t => t.id === templateId);
                if (template) {
                    setActivePanelLayout(template);
                    setSelectedTemplate(template.id);
                }
            } catch (error) {
                console.error('Failed to load saved panel layout:', error);
            }
        }

        const savedStory = localStorage.getItem('selectedStory');
        const savedArc = localStorage.getItem('selectedArc');

        if (savedStory) {
            setSelectedStory(savedStory);
            fetchCharacters(savedStory);
            fetchArcs(savedStory);

            if (savedArc) {
                setSelectedArc(savedArc);
                fetchChapters(savedStory, savedArc);
            }
        }

        const savedChapter = localStorage.getItem('selectedChapter');
        if (savedChapter) {
            setSelectedChapter(savedChapter);
        }

        const savedCharacters = localStorage.getItem('selectedCharacters');
        if (savedCharacters) {
            try {
                setSelectedCharacters(JSON.parse(savedCharacters));
            } catch (error) {
                console.error('Failed to load saved characters:', error);
            }
        }

        const savedPrompt = localStorage.getItem('mangaPrompt');
        if (savedPrompt) {
            setPrompt(savedPrompt);
        }

        fetchStories();
    }, []);

    useEffect(() => {
        localStorage.setItem('mangaPages', JSON.stringify(pages));
    }, [pages]);

    const fetchStories = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/story/list`, {
                withCredentials: true,
            });
            setStories(response.data);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        }
    };

    const fetchCharacters = async (storyId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/character/by-story/${storyId}`, {
                withCredentials: true,
            });
            setCharacters(response.data);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        }
    };

    const fetchArcs = async (storyId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/story/${storyId}/arcs`, {
                withCredentials: true,
            });
            setArcs(response.data.arcs || []);
        } catch (error) {
            console.error('Failed to fetch arcs:', error);
            setArcs([]);
        }
    };

    const fetchChapters = async (storyId, arcId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/story/${storyId}/arcs/${arcId}/chapters`, {
                withCredentials: true,
            });
            setChapters(response.data.chapters || []);
        } catch (error) {
            console.error('Failed to fetch chapters:', error);
            setChapters([]);
        }
    };

    const handleStorySelect = (storyId) => {
        setSelectedStory(storyId);
        localStorage.setItem('selectedStory', storyId);
        setSelectedCharacters([]);
        setSelectedArc('');
        setSelectedChapter('');
        localStorage.removeItem('selectedCharacters');
        localStorage.removeItem('selectedArc');
        localStorage.removeItem('selectedChapter');
        if (storyId) {
            fetchCharacters(storyId);
            fetchArcs(storyId);
        } else {
            setCharacters([]);
            setArcs([]);
            setChapters([]);
        }
    };

    const handleArcSelect = (arcId) => {
        setSelectedArc(arcId);
        localStorage.setItem('selectedArc', arcId);
        setSelectedChapter('');
        localStorage.removeItem('selectedChapter');
        if (arcId && selectedStory) {
            fetchChapters(selectedStory, arcId);
        } else {
            setChapters([]);
        }
    };

    const handleChapterSelect = async (chapterId) => {
        setSelectedChapter(chapterId);
        localStorage.setItem('selectedChapter', chapterId);

        // Fetch full story and build comprehensive prompt
        if (chapterId && selectedStory && selectedArc) {
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/story/${selectedStory}`,
                    { withCredentials: true }
                );

                if (response.data) {
                    const story = response.data;
                    const arc = story.story_arcs?.find(a => a.arc_id === selectedArc);
                    const chapter = arc?.chapters?.find(c => c.chapter_id === chapterId);

                    // Build comprehensive story prompt
                    let fullPrompt = '';

                    // Story title and metadata
                    fullPrompt += `Story: ${story.story_metadata?.title || 'Untitled'}\n`;
                    fullPrompt += `Genre: ${story.story_metadata?.genre?.join(', ') || 'N/A'}\n`;
                    fullPrompt += `Tone: ${story.story_metadata?.tone || 'N/A'}\n\n`;

                    // World building
                    if (story.world_building) {
                        fullPrompt += `Setting: ${story.world_building.setting || 'N/A'}\n`;
                        fullPrompt += `Time Period: ${story.world_building.time_period || 'N/A'}\n\n`;
                    }

                    // Arc info
                    if (arc) {
                        fullPrompt += `Arc: ${arc.arc_title}\n`;
                        fullPrompt += `Arc Summary: ${arc.arc_summary}\n\n`;
                    }

                    // Chapter info
                    if (chapter) {
                        fullPrompt += `Chapter: ${chapter.chapter_title}\n`;
                        fullPrompt += `Chapter Purpose: ${chapter.chapter_purpose}\n\n`;

                        // Scene summaries
                        if (chapter.scenes && chapter.scenes.length > 0) {
                            fullPrompt += `Scenes:\n`;
                            chapter.scenes.forEach((scene, idx) => {
                                fullPrompt += `${idx + 1}. ${scene.scene_summary}\n`;
                                fullPrompt += `   Setting: ${scene.setting}\n`;
                                fullPrompt += `   Emotional Beat: ${scene.emotional_beat}\n`;
                            });
                        }
                    }

                    setPrompt(fullPrompt.trim());
                    localStorage.setItem('mangaPrompt', fullPrompt.trim());
                    setRefinedStoryText('');
                }
            } catch (error) {
                console.error('Failed to fetch full story:', error);
                // Fallback to chapter purpose
                const selectedChapterData = chapters.find(c => c.chapter_id === chapterId);
                if (selectedChapterData?.chapter_purpose) {
                    setPrompt(selectedChapterData.chapter_purpose);
                    localStorage.setItem('mangaPrompt', selectedChapterData.chapter_purpose);
                    setRefinedStoryText('');
                }
            }
        }
    };

    const handleCharacterToggle = (characterId) => {
        setSelectedCharacters(prev => {
            const updated = prev.includes(characterId)
                ? prev.filter(id => id !== characterId)
                : [...prev, characterId];
            localStorage.setItem('selectedCharacters', JSON.stringify(updated));
            return updated;
        });
    };

    const addPage = () => {
        const newId = Math.max(...pages.map(p => p.id), 0) + 1;
        const newPage = { id: newId, panels: [], templateId: null, elements: [] };
        setPages(prev => [...prev, newPage]);
        setActivePageId(newId);
        setActivePanelLayout(null);
        setSelectedTemplate(null);
        setActivePanelId(null);
    };

    const deletePage = (pageId) => {
        if (pages.length <= 1) {
            alert('Cannot delete the last page!');
            return;
        }
        if (!window.confirm(`Are you sure you want to delete Page ${pageId}?`)) {
            return;
        }
        const pageIndex = pages.findIndex(p => p.id === pageId);
        setPages(prev => prev.filter(p => p.id !== pageId));
        if (activePageId === pageId) {
            const newActiveIndex = pageIndex > 0 ? pageIndex - 1 : 0;
            const remainingPages = pages.filter(p => p.id !== pageId);
            if (remainingPages[newActiveIndex]) {
                setActivePageId(remainingPages[newActiveIndex].id);
            }
        }
    };

    const activePage = pages.find(p => p.id === activePageId);
    const canvasElements = activePage?.elements || [];

    const handleElementsChange = (newElements) => {
        setPages(prev => prev.map(p =>
            p.id === activePageId ? { ...p, elements: newElements } : p
        ));
        addToHistory(newElements);
    };

    const addToHistory = (elements) => {
        setHistory(prev => ({
            past: [...prev.past, prev.present],
            present: elements,
            future: []
        }));
    };

    const undo = () => {
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, history.past.length - 1);
        setHistory({
            past: newPast,
            present: previous,
            future: [history.present, ...history.future]
        });
        setPages(prev => prev.map(p =>
            p.id === activePageId ? { ...p, elements: previous } : p
        ));
    };

    const redo = () => {
        if (history.future.length === 0) return;
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        setHistory({
            past: [...history.past, history.present],
            present: next,
            future: newFuture
        });
        setPages(prev => prev.map(p =>
            p.id === activePageId ? { ...p, elements: next } : p
        ));
    };

    const handlePageSelect = (pageId) => {
        setActivePageId(pageId);
        const page = pages.find(p => p.id === pageId);
        if (page && page.templateId) {
            const template = panelTemplates.find(t => t.id === page.templateId);
            if (template) {
                setActivePanelLayout(template);
                setSelectedTemplate(template.id);
            }
        } else {
            setActivePanelLayout(null);
            setSelectedTemplate(null);
        }
        setActivePanelId(null);
    };

    const handleRefinePrompt = async () => {
        if (!prompt.trim()) return;
        setIsRefining(true);
        try {
            const refined = await refinePrompt(prompt);
            // Store refined text separately instead of replacing original
            setRefinedStoryText(refined);
            localStorage.setItem('refinedStoryText', refined);
        } catch (error) {
            console.error('Failed to refine prompt:', error);
        } finally {
            setIsRefining(false);
        }
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template.id);
    };

    const handleAcceptTemplate = () => {
        if (!selectedTemplate) return;
        const template = panelTemplates.find(t => t.id === selectedTemplate);
        if (template) {
            setActivePanelLayout(template);
            setPages(prev => prev.map(p =>
                p.id === activePageId ? { ...p, templateId: template.id } : p
            ));
            localStorage.setItem('activePanelLayoutId', template.id.toString());
            setActivePanelId(null);
        }
    };

    const handleResetPanels = () => {
        setActivePanelLayout(null);
        setSelectedTemplate(null);
        setActivePanelId(null);
        setPages(prev => prev.map(p =>
            p.id === activePageId ? { ...p, templateId: null } : p
        ));
        localStorage.removeItem('activePanelLayoutId');
        localStorage.removeItem('selectedStory');
        localStorage.removeItem('selectedCharacters');
        localStorage.removeItem('mangaPrompt');
        localStorage.removeItem('mangaPages');
        setPages([{ id: 1, panels: [] }]);
        setActivePageId(1);
    };

    // Update a specific panel's image
    const handlePanelImageUpdate = (panelId, imageUrl) => {
        setPages(prev => prev.map(page => {
            if (page.id === activePageId) {
                // Update the panel's image in the current page
                const updatedPanels = (page.panels || []).map(panel => {
                    if (panel.id === panelId) {
                        return { ...panel, imageUrl };
                    }
                    return panel;
                });
                return { ...page, panels: updatedPanels };
            }
            return page;
        }));

        // Also save to localStorage
        localStorage.setItem('mangaPages', JSON.stringify(pages));
    };

    return (
        <div className="manga-creator-page">
            <MangaHeader
                onBack={() => navigate('/')}
                userData={userData}
                isPinned={isPinned}
                onPinToggle={() => setIsPinned(!isPinned)}
            />

            <div className="manga-content">
                {/* Selection Sidebar */}
                <div style={{ width: `${selectionWidth}px`, minWidth: '150px', flexShrink: 0, overflowY: 'auto' }}>
                    <SelectionSidebar
                        stories={stories}
                        selectedStory={selectedStory}
                        onStorySelect={handleStorySelect}
                        arcs={arcs}
                        selectedArc={selectedArc}
                        onArcSelect={handleArcSelect}
                        chapters={chapters}
                        selectedChapter={selectedChapter}
                        onChapterSelect={handleChapterSelect}
                        characters={characters}
                        selectedCharacters={selectedCharacters}
                        onCharacterToggle={handleCharacterToggle}
                    />
                </div>

                <div
                    className="custom-resize-handle"
                    onMouseDown={() => setIsDragging('selection')}
                />

                {/* Panel Sidebar */}
                <div style={{ width: `${panelWidth}px`, minWidth: '150px', flexShrink: 0, overflowY: 'auto' }}>
                    <PanelSidebar
                        pages={pages}
                        activePageId={activePageId}
                        onPageSelect={handlePageSelect}
                        onAddPage={addPage}
                        onDeletePage={deletePage}
                        panelTemplates={panelTemplates}
                        selectedTemplate={selectedTemplate}
                        onTemplateSelect={handleTemplateSelect}
                        onAcceptTemplate={handleAcceptTemplate}
                    />
                </div>

                <div
                    className="custom-resize-handle"
                    onMouseDown={() => setIsDragging('panel')}
                />

                {/* Main Canvas Area */}
                <div className="canvas-container-flex" style={{ flex: 1, overflow: 'hidden' }}>
                    <MangaCanvas
                        activePanelLayout={activePanelLayout}
                        activePanelId={activePanelId}
                        onPanelSelect={(id) => setActivePanelId(id)}
                        activeTool={activeTool}
                        onToolChange={setActiveTool}
                        canvasElements={canvasElements}
                        onElementsChange={handleElementsChange}
                        selectedElement={selectedElement}
                        onSelectElement={setSelectedElement}
                        onUndo={undo}
                        onRedo={redo}
                        canUndo={history.past.length > 0}
                        canRedo={history.future.length > 0}
                        panelImages={activePage?.panels || []}
                    />
                </div>

                <div
                    className="custom-resize-handle"
                    onMouseDown={() => setIsDragging('prompt')}
                />

                {/* Right Sidebar */}
                <div style={{ width: `${promptWidth}px`, minWidth: '200px', flexShrink: 0, overflowY: 'auto' }}>
                    <RightSidebar
                        prompt={prompt}
                        onPromptChange={(value) => {
                            setPrompt(value);
                            localStorage.setItem('mangaPrompt', value);
                        }}
                        refinedStoryText={refinedStoryText}
                        isRefining={isRefining}
                        onRefinePrompt={handleRefinePrompt}
                        onResetPanels={handleResetPanels}
                        activePanelId={activePanelId}
                        selectedStory={selectedStory}
                        selectedCharacters={selectedCharacters}
                        characters={characters}
                        panelPrompts={panelPrompts}
                        setPanelPrompts={setPanelPrompts}
                        panelCharacters={panelCharacters}
                        setPanelCharacters={setPanelCharacters}
                        pages={pages}
                        activePageId={activePageId}
                        onPageSelect={handlePageSelect}
                        onPanelImageUpdate={handlePanelImageUpdate}
                    />
                </div>
            </div>
        </div>
    );
};

export default MangaCreator;
