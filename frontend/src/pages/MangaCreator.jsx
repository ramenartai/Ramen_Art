import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import refinePrompt from '../utils/aiOptimize';
import MangaHeader from '../manga/MangaHeader';
import LeftSidebar from '../manga/LeftSidebar';
import MangaCanvas from '../manga/MangaCanvas';
import RightSidebar from '../manga/RightSidebar';
import '../Css/MangaCreator.css';

const MangaCreator = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [characters, setCharacters] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [panels, setPanels] = useState([
        { id: 1, name: 'Panel 1', visible: true },
        { id: 2, name: 'Panel 2', visible: true },
        { id: 3, name: 'Panel 3', visible: true },
        { id: 4, name: 'Panel 4', visible: true }
    ]);
    const [prompt, setPrompt] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isPinned, setIsPinned] = useState(false);
    const [activePanelLayout, setActivePanelLayout] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const panelTemplates = [
        { id: 1, layout: 'single', svg: <rect x="10" y="10" width="80" height="120" rx="4" /> },
        { id: 2, layout: 'horizontal-3', svg: <><rect x="10" y="10" width="80" height="35" rx="4" /><rect x="10" y="50" width="80" height="35" rx="4" /><rect x="10" y="90" width="80" height="40" rx="4" /></> },
        { id: 3, layout: 'grid-4', svg: <><rect x="10" y="10" width="38" height="58" rx="4" /><rect x="52" y="10" width="38" height="58" rx="4" /><rect x="10" y="72" width="38" height="58" rx="4" /><rect x="52" y="72" width="38" height="58" rx="4" /></> },
        { id: 4, layout: 'vertical-split', svg: <><rect x="10" y="10" width="38" height="40" rx="4" /><rect x="52" y="10" width="38" height="40" rx="4" /><rect x="10" y="55" width="80" height="35" rx="4" /><rect x="10" y="95" width="80" height="35" rx="4" /></> },
        { id: 5, layout: 'horizontal-split', svg: <><rect x="10" y="10" width="80" height="35" rx="4" /><rect x="10" y="50" width="80" height="35" rx="4" /><rect x="10" y="90" width="38" height="40" rx="4" /><rect x="52" y="90" width="38" height="40" rx="4" /></> },
        { id: 6, layout: 'l-shape', svg: <><rect x="10" y="10" width="38" height="40" rx="4" /><rect x="52" y="10" width="38" height="40" rx="4" /><rect x="10" y="55" width="80" height="35" rx="4" /><rect x="10" y="95" width="38" height="35" rx="4" /><rect x="52" y="95" width="38" height="35" rx="4" /></> },
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }

        // Load saved panel layout from localStorage
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

        // Load saved story selection
        const savedStory = localStorage.getItem('selectedStory');
        if (savedStory) {
            setSelectedStory(savedStory);
            fetchCharacters(savedStory);
        }

        // Load saved characters
        const savedCharacters = localStorage.getItem('selectedCharacters');
        if (savedCharacters) {
            try {
                setSelectedCharacters(JSON.parse(savedCharacters));
            } catch (error) {
                console.error('Failed to load saved characters:', error);
            }
        }

        // Load saved prompt
        const savedPrompt = localStorage.getItem('mangaPrompt');
        if (savedPrompt) {
            setPrompt(savedPrompt);
        }

        // Load saved panels
        const savedPanels = localStorage.getItem('mangaPanels');
        if (savedPanels) {
            try {
                setPanels(JSON.parse(savedPanels));
            } catch (error) {
                console.error('Failed to load saved panels:', error);
            }
        }

        fetchStories();
    }, []);
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

    const handleStorySelect = (storyId) => {
        setSelectedStory(storyId);
        localStorage.setItem('selectedStory', storyId);
        setSelectedCharacters([]);
        localStorage.removeItem('selectedCharacters');
        if (storyId) {
            fetchCharacters(storyId);
        } else {
            setCharacters([]);
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

    const handlePanelToggle = (panelId) => {
        setPanels(prev => {
            const updated = prev.map(panel =>
                panel.id === panelId ? { ...panel, visible: !panel.visible } : panel
            );
            localStorage.setItem('mangaPanels', JSON.stringify(updated));
            return updated;
        });
    };

    const addPanel = () => {
        const newId = Math.max(...panels.map(p => p.id), 0) + 1;
        const updated = [...panels, { id: newId, name: `Panel ${newId}`, visible: true }];
        setPanels(updated);
        localStorage.setItem('mangaPanels', JSON.stringify(updated));
    };

    const handleRefinePrompt = async () => {
        if (!prompt.trim()) return;

        setIsRefining(true);
        try {
            const refined = await refinePrompt(prompt);
            setPrompt(refined);
            localStorage.setItem('mangaPrompt', refined);
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
            // Save only the template ID to localStorage (not the JSX)
            localStorage.setItem('activePanelLayoutId', template.id.toString());
            console.log('Template applied:', template.layout);
        }
    };

    const handleResetPanels = () => {
        setActivePanelLayout(null);
        setSelectedTemplate(null);
        // Remove from localStorage
        localStorage.removeItem('activePanelLayoutId');
        localStorage.removeItem('selectedStory');
        localStorage.removeItem('selectedCharacters');
        localStorage.removeItem('mangaPrompt');
        localStorage.removeItem('mangaPanels');
        console.log('Panels reset');
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
                <LeftSidebar
                    stories={stories}
                    selectedStory={selectedStory}
                    onStorySelect={handleStorySelect}
                    characters={characters}
                    selectedCharacters={selectedCharacters}
                    onCharacterToggle={handleCharacterToggle}
                    panelTemplates={panelTemplates}
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={handleTemplateSelect}
                    onAcceptTemplate={handleAcceptTemplate}
                />

                <MangaCanvas
                    activePanelLayout={activePanelLayout}
                    panels={panels}
                    onPanelToggle={handlePanelToggle}
                    onAddPanel={addPanel}
                />

                <RightSidebar
                    prompt={prompt}
                    onPromptChange={(value) => {
                        setPrompt(value);
                        localStorage.setItem('mangaPrompt', value);
                    }}
                    isRefining={isRefining}
                    onRefinePrompt={handleRefinePrompt}
                    onResetPanels={handleResetPanels}
                />
            </div>
        </div>
    );
};

export default MangaCreator;
