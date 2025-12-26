import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import User from '../Components/User';
import Toast from '../Components/Toast';
import refinePrompt from '../utils/aiOptimize';
import '../Css/CharGen.css';

const CharGen = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isRefining, setIsRefining] = useState(false);
    const [hasRefined, setHasRefined] = useState(false);
    const [userData, setUserData] = useState(null);
    // Character management states
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [characterName, setCharacterName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [toast, setToast] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Fetch user stories on mount
    React.useEffect(() => {
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
        fetchStories();
    }, []);

    useEffect(() => {
        // Fetch user data from localStorage or API
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    // Save character function
    const handleSaveCharacter = async () => {
        if (!selectedStory) {
            showToast('Please select a story first!', 'warning');
            return;
        }
        if (!characterName.trim()) {
            showToast('Please enter a character name!', 'warning');
            return;
        }
        if (!generatedImage) {
            showToast('Please generate a character image first!', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/character/save`,
                {
                    story_id: selectedStory,
                    character_name: characterName,
                    image_url: generatedImage,
                    prompt: getFullPrompt()
                },
                { withCredentials: true }
            );

            if (response.status === 201) {
                setIsSaved(true);
                showToast('Character saved successfully! ✨', 'success');
            }
        } catch (error) {
            console.error('Failed to save character:', error);
            showToast('Failed to save character. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const [activeDropdown, setActiveDropdown] = useState(null);

    // Dropdown options based on the images
    const dropdownOptions = {
        gender: ['Female', 'Male', 'Non-binary'],
        style: ['Anime', 'Manga', 'Realistic', 'Chibi', 'Semi-realistic'],
        age: ['Child', 'Teen', 'Young Adult', 'Adult', 'Elder'],
        body: ['Slim', 'Athletic', 'Muscular', 'Curvy', 'Average', 'Petite'],
        hair: [
            'Black Hair', 'Brown Hair', 'Blonde Hair', 'Red Hair', 'Blue Hair', 'Yellow Hair',
            'Green Hair', 'Purple Hair', 'Pink Hair', 'White Hair', 'Gray Hair',
            'Straight Hair', 'Wavy Hair', 'Curly Hair', 'Frizzy Hair', 'Dreadlocks',
            'Spiky Hair', 'Braid', 'Ponytail', 'Twin Tails', 'Bun', 'Long Hair',
            'Short Hair', 'Medium Hair', 'Pixie Cut', 'Undercut', 'Mohawk',
            'Buzz Cut', 'Bob Cut', 'Mullet', 'Mushroom Cut'
        ],
        eyes: [
            'Blue Eyes', 'Brown Eyes', 'Green Eyes', 'Hazel Eyes', 'Gray Eyes',
            'Amber Eyes', 'Red Eyes', 'Purple Eyes', 'Heterochromia'
        ],
        face: ['Freckles', 'Mole', 'Beard', 'Mustache', 'Scar', 'Tattoo'],
        skin: [
            'Pale', 'Fair', 'Light', 'Medium', 'Tan', 'Olive', 'Brown', 'Dark',
            'Ebony', 'Porcelain', 'Beige', 'Honey', 'Caramel', 'Chocolate'
        ],
        top: [
            'T-shirt', 'Vest', 'Hoodie', 'Spread Shirt', 'Bohemian Shirt',
            'Fantasy Shirt', 'Knitted Cardigan', 'Lab Coat', 'Leather Jacket',
            'Plain Leather Jacket', 'Varsity Jacket', 'Outdoor Adventure Jacket',
            'Polo Shirt', 'Kimono Vest', 'School Vest'
        ],
        bottom: [
            'Jeans', 'Shorts', 'Skirt', 'Leggings', 'Cargo Pants', 'Sweatpants',
            'Dress Pants', 'Joggers', 'Capris', 'Culottes'
        ],
        set: [
            'School Uniform', 'Business Suit', 'Casual Outfit', 'Sports Wear',
            'Traditional Kimono', 'Fantasy Armor', 'Steampunk', 'Cyberpunk'
        ],
        material: [
            'Cotton', 'Leather', 'Silk', 'Denim', 'Wool', 'Polyester',
            'Linen', 'Velvet', 'Satin', 'Metal'
        ],
        accessory: [
            'Glasses', 'Sunglasses', 'Hat', 'Cap', 'Headband', 'Earrings',
            'Necklace', 'Bracelet', 'Watch', 'Scarf', 'Gloves', 'Bag',
            'Backpack', 'Belt', 'Tie', 'Bow Tie'
        ]
    };

    const handleDropdownToggle = (category) => {
        setActiveDropdown(activeDropdown === category ? null : category);
    };

    const handleOptionSelect = (category, value) => {
        // Add the selected value as a tag if it's not already there
        if (!selectedTags.includes(value)) {
            setSelectedTags(prev => [...prev, value]);
        }
        setActiveDropdown(null);
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    // Get the full prompt that will be sent in request body
    const getFullPrompt = () => {
        const tagsText = selectedTags.join(', ');
        if (description && tagsText) {
            return `${description}, ${tagsText} `;
        }
        return description || tagsText;
    };

    // Get display text for input field (shows both description and tags)
    const getDisplayText = () => {
        const tagsText = selectedTags.join(', ');
        if (description && tagsText) {
            return `${description}, ${tagsText}`;
        }
        return description || tagsText;
    };

    const handleInspireMe = () => {
        const inspirations = [
            "A mysterious warrior with silver hair and piercing blue eyes, wearing dark armor",
            "A cheerful magical girl with pink twin tails and sparkling green eyes",
            "A stoic samurai with black hair in a ponytail, wearing traditional hakama",
            "A cyberpunk hacker with neon blue hair and tech goggles",
            "An elegant elf princess with long blonde hair and emerald eyes"
        ];
        const randomInspiration = inspirations[Math.floor(Math.random() * inspirations.length)];
        setDescription(randomInspiration);
    };
    const handleRefine = async () => {
        const fullPrompt = getFullPrompt();
        if (!fullPrompt.trim()) return;

        setIsRefining(true);
        try {
            console.log('Refining prompt:', fullPrompt);
            const refined = await refinePrompt(fullPrompt);
            console.log('Received refined:', refined);
            console.log('Setting description to:', refined);
            setDescription(refined);
            setHasRefined(true); // Mark that user has refined the prompt
            console.log('Description state updated');
            showToast('Prompt refined successfully!', 'success');
        } catch (error) {
            console.error('Refinement error:', error);
            showToast('Failed to refine prompt', 'error');
        } finally {
            setIsRefining(false);
        }
    };
    const handleGenerate = async () => {
        const fullPrompt = getFullPrompt();

        if (!fullPrompt.trim()) {
            showToast('Please add a description or select some character features!', 'warning');
            return;
        }
        if (!hasRefined) {
            showToast('Pro tip: Click the 🎆 button to refine your prompt with AI! The better the prompt, the better the results.', 'info');
        }

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            let finalPrompt = fullPrompt;
            if (isRefining) {
                finalPrompt = await refinePrompt(fullPrompt);
            }

            const requestBody = {
                prompt: finalPrompt,
                resolution: "1024x1024 ( 1:1 )",
                steps: 8,
                shift: 3,
                seed: 42,
                random_seed: true
            };

            console.log('Sending request:', requestBody);

            const response = await axios.post('http://127.0.0.1:8000/api/z-image/generate', requestBody);

            console.log('Response:', response.data);
            setGeneratedImage(response.data.image_url);

        } catch (error) {
            console.error('Error generating character:', error);
            showToast('Failed to generate character. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle typing in textarea (extracts description from combined text)
    const handleDescriptionChange = (e) => {
        const fullText = e.target.value;
        const tagsText = selectedTags.join(', ');

        // Remove tags part to get pure description
        let newDescription = fullText;
        if (tagsText && fullText.endsWith(tagsText)) {
            // If tags are at the end, remove them (and the comma separator if present)
            newDescription = fullText.substring(0, fullText.length - tagsText.length);
            if (newDescription.endsWith(', ')) {
                newDescription = newDescription.substring(0, newDescription.length - 2);
            }
        }

        setDescription(newDescription);
    };

    return (
        <div className="chargen-page">
            {/* Header */}
            <header className="chargen-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>
                    <h1 className="page-title">OC Maker</h1>
                </div>
                <div className="header-right">
                    <div className="header-actions">
                        <User userData={userData} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="chargen-main">
                <p className="subtitle">Create your original character (OC) with AI magic - generate unique appearances, personalities, and backstories</p>

                <div className="chargen-container">
                    {/* Left Panel - Character Form */}
                    <div className="form-panel">
                        <div className="form-card">
                            {/* Story Selection */}
                            <div className="story-selection-section">
                                <label className="input-label">Select Story</label>
                                <select
                                    className="story-select"
                                    value={selectedStory}
                                    onChange={(e) => setSelectedStory(e.target.value)}
                                >
                                    <option value="">Choose a story...</option>
                                    {stories.map((story) => (
                                        <option key={story.id} value={story.id}>
                                            {story.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Character Name */}
                            <div className="character-name-section">
                                <label className="input-label">Character Name</label>
                                <input
                                    type="text"
                                    className="character-name-input"
                                    placeholder="Enter character name..."
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value)}
                                />
                            </div>

                            <div className="card-header">
                                <h2 className="card-title">Character Appearance</h2>
                                <button className="inspire-btn" onClick={handleInspireMe}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Inspire me
                                </button>
                            </div>

                            <div className="description-section">
                                <div className="description-wrapper">
                                    <textarea
                                        className="description-input"
                                        placeholder="Describe your OC's details (e.g., 'cat girl, blue hair, glasses, shy')"
                                        value={getDisplayText()}  // Shows BOTH description + tags
                                        onChange={handleDescriptionChange}  // Handles user typing and tag extraction
                                        rows="4"
                                    />
                                    {selectedTags.length > 0 && (
                                        <div className="selected-tags">
                                            {selectedTags.map((tag, index) => (
                                                <div key={index} className="tag-chip">
                                                    <span>{tag}</span>
                                                    <button
                                                        className="tag-remove"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        type="button"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="char-gen-refine-btn"
                                    onClick={handleRefine}
                                    disabled={isRefining || isGenerating || !getFullPrompt().trim()}
                                    title="Refine your prompt with AI"
                                >
                                    {isRefining || isGenerating ? 'Refining...' : 'Refine your prompt'}
                                </button>
                            </div>

                            {/* Category Buttons */}
                            <div className="category-buttons">
                                {Object.keys(dropdownOptions).map((category) => (
                                    <div key={category} className="dropdown-wrapper">
                                        <button
                                            className={`category-btn ${activeDropdown === category ? 'active' : ''}`}
                                            onClick={() => handleDropdownToggle(category)}
                                        >
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </button>
                                        {activeDropdown === category && (
                                            <div className="dropdown-menu">
                                                {dropdownOptions[category].map((option) => (
                                                    <div
                                                        key={option}
                                                        className={`dropdown-item ${selectedTags.includes(option) ? 'selected' : ''} `}
                                                        onClick={() => handleOptionSelect(category, option)}
                                                    >
                                                        {option}
                                                        {selectedTags.includes(option) && (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 'auto' }}>
                                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Generate Button */}
                            <button
                                className="generate-btn"
                                onClick={handleGenerate}
                                disabled={isGenerating || isRefining}
                            >
                                {isGenerating ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="spinning">
                                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        Generate character
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Preview */}
                    <div className="preview-panel">
                        <div className="preview-card">
                            {generatedImage ? (
                                <div className="preview-content">
                                    <img
                                        src={generatedImage}
                                        alt="Generated Character"
                                        className="generated-character-image"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    {/* Save/Pin Button */}
                                    <button
                                        className={`save-character-btn ${isSaved ? 'saved' : ''}`}
                                        onClick={handleSaveCharacter}
                                        disabled={isSaving || isSaved}
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="spinning">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                                Saving...
                                            </>
                                        ) : isSaved ? (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </svg>
                                                Saved!
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
                                                </svg>
                                                Save Character
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="preview-content">
                                    <h3 className="preview-title">Your characters will appear here</h3>
                                    <p className="preview-text">
                                        Describe your character's appearance and click "Generate character" to create your original character
                                    </p>
                                    <div className="preview-placeholder">
                                        <div className="placeholder-bg"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default CharGen;
