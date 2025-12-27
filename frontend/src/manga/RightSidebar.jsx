import React, { useState } from 'react';
import './css/RightSidebar.css';
import { mangaApi } from '../api/mangaApi';

const RightSidebar = ({
    prompt,
    onPromptChange,
    refinedStoryText,
    isRefining,
    onRefinePrompt,
    onResetPanels,
    activePanelId,
    selectedStory,
    selectedCharacters,
    characters,
    panelPrompts,
    setPanelPrompts,
    panelCharacters,
    setPanelCharacters,
    pages,
    activePageId,
    onPageSelect,
    onPanelImageUpdate
}) => {
    const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' or 'page'

    // Manga generation workflow state
    const [generationStep, setGenerationStep] = useState(null); // null, 'suggesting', 'optimizing', 'generating', 'complete', 'error'
    const [generationProgress, setGenerationProgress] = useState('');
    const [apiError, setApiError] = useState(null);

    // Page generation workflow state
    const [pageGenerationStep, setPageGenerationStep] = useState(null); // null, 'fetching', 'optimizing', 'generating', 'complete', 'error'
    const [pageGenerationProgress, setPageGenerationProgress] = useState('');
    const [pageApiError, setPageApiError] = useState(null);
    const [generatedPageImage, setGeneratedPageImage] = useState(null);

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

    // Helper functions for character data
    const getSelectedCharacterNames = () => {
        const selectedIds = panelCharacters[activePanelId] || [];
        return availableCharacters
            .filter(char => selectedIds.includes(char.id))
            .map(char => char.character_name);
    };

    const getSelectedCharacterImageUrls = () => {
        const selectedIds = panelCharacters[activePanelId] || [];
        return availableCharacters
            .filter(char => selectedIds.includes(char.id))
            .map(char => char.image_url)
            .filter(Boolean); // Remove null/undefined URLs
    };

    // Automated three-step manga panel generation workflow
    const handleGeneratePanel = async () => {
        try {
            setApiError(null);

            // Step 1: Suggest Action
            setGenerationStep('suggesting');
            setGenerationProgress('AI is suggesting panel action...');

            const suggestionResponse = await mangaApi.suggestAction({
                story_summary: refinedStoryText, // Use refined story text
                panel_number: activePanelId,
                previous_panels: Object.values(panelPrompts).filter(Boolean),
                characters_in_panel: getSelectedCharacterNames()
            });

            // Update panel action with AI suggestion
            setPanelPrompts(prev => ({
                ...prev,
                [activePanelId]: suggestionResponse.suggested_action
            }));

            // Step 2: Generate Optimized Prompt
            setGenerationStep('optimizing');
            setGenerationProgress('Optimizing prompt for image generation...');

            const promptResponse = await mangaApi.generatePanelPrompt({
                panel_action: suggestionResponse.suggested_action,
                characters: getSelectedCharacterNames(),
                style_notes: "manga style, black and white"
            });

            // Step 3: Generate Panel Image
            setGenerationStep('generating');
            setGenerationProgress('Generating manga panel image...');

            const imageResponse = await mangaApi.generatePanelImage({
                prompt: promptResponse.optimized_prompt,
                character_image_urls: getSelectedCharacterImageUrls(),
                width: 768,
                height: 1024,
                style: "manga"
            });

            setGenerationStep('complete');
            setGenerationProgress('Panel generated successfully!');

            // Update panel with generated image
            if (onPanelImageUpdate && imageResponse.image_url) {
                onPanelImageUpdate(activePanelId, imageResponse.image_url);
            }
            console.log('Generated image URL:', imageResponse.image_url);
            console.log('Prompt used:', imageResponse.prompt_used);

        } catch (error) {
            setGenerationStep('error');
            setApiError(error.message);
            console.error('Generation error:', error);
        }
    };

    // Handle Generate Page - fetches character images and generates full page
    const handleGeneratePage = async () => {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL;

        try {
            setPageApiError(null);
            setGeneratedPageImage(null);

            // Step 1: Fetch character images by story
            setPageGenerationStep('fetching');
            setPageGenerationProgress('Fetching character reference images...');

            let characterImageUrls = [];
            if (selectedStory) {
                const response = await fetch(`${BASE_URL}/api/character/by-story/${selectedStory}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const charactersData = await response.json();
                    characterImageUrls = charactersData
                        .map(char => char.image_url)
                        .filter(Boolean);
                }
            }

            // Step 2: Generate optimized prompt for page
            setPageGenerationStep('optimizing');
            setPageGenerationProgress('Optimizing prompt for image generation...');

            const promptResponse = await mangaApi.generatePanelPrompt({
                panel_action: refinedStoryText,
                characters: characters.filter(c => selectedCharacters.includes(c.id)).map(c => c.character_name),
                style_notes: "manga style, black and white, full manga page layout"
            });

            // Step 3: Generate page image
            setPageGenerationStep('generating');
            setPageGenerationProgress('Generating manga page image...');

            const imageResponse = await mangaApi.generatePanelImage({
                prompt: promptResponse.optimized_prompt,
                character_image_urls: characterImageUrls,
                width: 768,
                height: 1024,
                style: "manga"
            });

            setPageGenerationStep('complete');
            setPageGenerationProgress('Page generated successfully!');
            setGeneratedPageImage(imageResponse.image_url);

            console.log('Generated page image URL:', imageResponse.image_url);
            console.log('Prompt used:', imageResponse.prompt_used);

        } catch (error) {
            setPageGenerationStep('error');
            setPageApiError(error.message);
            console.error('Page generation error:', error);
        }
    };

    if (activePanelId) {
        return (
            <aside className="right-sidebar panel-mode">
                {/* Tabs */}
                <div className="sidebar-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prompt')}
                    >
                        Prompt
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'page' ? 'active' : ''}`}
                        onClick={() => setActiveTab('page')}
                    >
                        Page
                    </button>
                </div>

                <div className="chat-header">
                    <h3>Panel Configuration</h3>
                    <div className="panel-badge">Panel {activePanelId}</div>
                </div>

                <div className="chat-content">
                    {/* Panel Scene Description */}
                    <div className="prompt-section">
                        <label className="prompt-label">Panel Action</label>
                        <textarea
                            className="prompt-textarea"
                            placeholder="AI will suggest what happens in this panel based on your story..."
                            value={panelPrompts[activePanelId] || ''}
                            onChange={handlePanelPromptChange}
                            rows="4"
                            readOnly={generationStep && generationStep !== 'complete' && generationStep !== 'error'}
                        />
                    </div>

                    {/* Progress Indicator */}
                    {generationStep && generationStep !== 'complete' && (
                        <div className="generation-progress">
                            <div className="progress-steps">
                                <div className={`progress-step ${generationStep === 'suggesting' || generationStep === 'optimizing' || generationStep === 'generating' ? 'active' : ''} ${generationStep === 'optimizing' || generationStep === 'generating' ? 'complete' : ''}`}>
                                    <span className="step-number">1</span>
                                    <span className="step-label">Suggest</span>
                                </div>
                                <div className="progress-line"></div>
                                <div className={`progress-step ${generationStep === 'optimizing' || generationStep === 'generating' ? 'active' : ''} ${generationStep === 'generating' ? 'complete' : ''}`}>
                                    <span className="step-number">2</span>
                                    <span className="step-label">Optimize</span>
                                </div>
                                <div className="progress-line"></div>
                                <div className={`progress-step ${generationStep === 'generating' ? 'active' : ''}`}>
                                    <span className="step-number">3</span>
                                    <span className="step-label">Generate</span>
                                </div>
                            </div>
                            <p className="progress-message">{generationProgress}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {generationStep === 'complete' && (
                        <div className="generation-success">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            <span>{generationProgress}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {apiError && (
                        <div className="generation-error">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <span>{apiError}</span>
                            <button
                                className="retry-btn"
                                onClick={() => {
                                    setApiError(null);
                                    setGenerationStep(null);
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

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

                    <button
                        className="generate-btn"
                        onClick={handleGeneratePanel}
                        disabled={!refinedStoryText.trim() || (generationStep && generationStep !== 'complete' && generationStep !== 'error')}
                    >
                        {generationStep && generationStep !== 'complete' && generationStep !== 'error' ? (
                            <>
                                <svg className="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <span>Generate Panel</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside className="right-sidebar">
            {/* Tabs */}
            <div className="sidebar-tabs">
                <button
                    className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
                    onClick={() => setActiveTab('prompt')}
                >
                    Prompt
                </button>
                <button
                    className={`tab-btn ${activeTab === 'page' ? 'active' : ''}`}
                    onClick={() => setActiveTab('page')}
                >
                    Page
                </button>
            </div>

            <div className="chat-header">
                <h3>{activeTab === 'prompt' ? 'Story Prompt' : 'Pages'}</h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                </svg>
            </div>

            <div className="chat-content">
                {activeTab === 'prompt' ? (
                    <>
                        <div className="prompt-section">
                            <label className="prompt-label">Scene Description</label>
                            <textarea
                                className="prompt-textarea"
                                placeholder="Story text will appear here when you select a chapter..."
                                value={prompt}
                                onChange={(e) => onPromptChange(e.target.value)}
                                rows="4"
                                readOnly
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

                        {/* Refined Story Text Section */}
                        {refinedStoryText && (
                            <div className="refined-text-section">
                                <label className="prompt-label">AI-Refined Story Context</label>
                                <div className="refined-text-display">
                                    {refinedStoryText}
                                </div>
                            </div>
                        )}

                        <div className="settings-section">
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

                        {/* Page Generation Progress */}
                        {pageGenerationStep && pageGenerationStep !== 'complete' && pageGenerationStep !== 'error' && (
                            <div className="generation-progress">
                                <div className="progress-steps">
                                    <div className={`progress-step ${pageGenerationStep === 'fetching' || pageGenerationStep === 'optimizing' || pageGenerationStep === 'generating' ? 'active' : ''} ${pageGenerationStep === 'optimizing' || pageGenerationStep === 'generating' ? 'complete' : ''}`}>
                                        <span className="step-number">1</span>
                                        <span className="step-label">Fetch</span>
                                    </div>
                                    <div className="progress-line"></div>
                                    <div className={`progress-step ${pageGenerationStep === 'optimizing' || pageGenerationStep === 'generating' ? 'active' : ''} ${pageGenerationStep === 'generating' ? 'complete' : ''}`}>
                                        <span className="step-number">2</span>
                                        <span className="step-label">Optimize</span>
                                    </div>
                                    <div className="progress-line"></div>
                                    <div className={`progress-step ${pageGenerationStep === 'generating' ? 'active' : ''}`}>
                                        <span className="step-number">3</span>
                                        <span className="step-label">Generate</span>
                                    </div>
                                </div>
                                <p className="progress-message">{pageGenerationProgress}</p>
                            </div>
                        )}

                        {/* Page Generation Success */}
                        {pageGenerationStep === 'complete' && (
                            <div className="generation-success">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                                <span>{pageGenerationProgress}</span>
                            </div>
                        )}

                        {/* Page Generation Error */}
                        {pageApiError && (
                            <div className="generation-error">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span>{pageApiError}</span>
                                <button
                                    className="retry-btn"
                                    onClick={() => {
                                        setPageApiError(null);
                                        setPageGenerationStep(null);
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Generated Page Image Preview */}
                        {generatedPageImage && (
                            <div className="generated-image-preview">
                                <label className="prompt-label">Generated Page</label>
                                <img src={generatedPageImage} alt="Generated manga page" />
                            </div>
                        )}

                        <button
                            className="generate-btn"
                            onClick={handleGeneratePage}
                            disabled={!refinedStoryText || (pageGenerationStep && pageGenerationStep !== 'complete' && pageGenerationStep !== 'error')}
                        >
                            {pageGenerationStep && pageGenerationStep !== 'complete' && pageGenerationStep !== 'error' ? (
                                <>
                                    <svg className="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <span>Generate Page</span>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="page-preview-section">
                        <div className="page-preview-header">
                            <span className="page-count">{pages.length} {pages.length === 1 ? 'Page' : 'Pages'}</span>
                        </div>
                        <div className="page-preview-grid">
                            {pages.map((page) => (
                                <div
                                    key={page.id}
                                    className={`page-preview-card ${activePageId === page.id ? 'active' : ''}`}
                                    onClick={() => onPageSelect(page.id)}
                                >
                                    <div className="page-preview-thumbnail">
                                        <div className="page-preview-number">{page.id}</div>
                                    </div>
                                    <span className="page-preview-label">Page {page.id}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default RightSidebar;
