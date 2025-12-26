import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/CharGen.css';

const CharGen = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [aiOptimize, setAiOptimize] = useState(true);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    // Dropdown options based on the images
    const dropdownOptions = {
        gender: ['Female', 'Male', 'Non-binary'],
        style: ['Anime', 'Manga', 'Realistic', 'Chibi', 'Semi-realistic'],
        age: ['Child', 'Teen', 'Young Adult', 'Adult', 'Elder'],
        body: ['Slim', 'Athletic', 'Muscular', 'Curvy', 'Average', 'Petite'],
        hair: [
            'Black Hair', 'Brown Hair', 'Blonde Hair', 'Red Hair', 'Blue Hair',
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

    const [activeDropdown, setActiveDropdown] = useState(null);

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

    // Get display text for input field (shows tags as comma-separated)
    const getDisplayText = () => {
        const tagsText = selectedTags.join(', ');
        if (description && tagsText) {
            return `${description}, ${tagsText} `;
        }
        return description || tagsText;
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setUploadedImages(prev => [...prev, ...newImages].slice(0, 9));
    };

    const handleRemoveImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
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

    const handleGenerate = async () => {
        const fullPrompt = getFullPrompt();

        if (!fullPrompt.trim()) {
            alert('Please add a description or select some character features!');
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null); // Clear previous image

        try {
            const requestBody = {
                prompt: fullPrompt,
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
            alert('Failed to generate character. Please try again.');
        } finally {
            setIsGenerating(false);
        }
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
                    <button className="discord-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                        Join Discord
                    </button>
                    <div className="user-avatar">U</div>
                </div>
            </header>

            {/* Main Content */}
            <div className="chargen-main">
                <p className="subtitle">Create your original character (OC) with AI magic - generate unique appearances, personalities, and backstories</p>

                <div className="chargen-container">
                    {/* Left Panel - Character Form */}
                    <div className="form-panel">
                        <div className="form-card">
                            <div className="card-header">
                                <h2 className="card-title">Character Appearance</h2>
                                <button className="inspire-btn" onClick={handleInspireMe}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Inspire me
                                </button>
                            </div>

                            {/* Description Textarea with Tags */}
                            <div className="description-section">
                                <div className="description-wrapper">
                                    <textarea
                                        className="description-input"
                                        placeholder="Describe your OC's details (e.g., 'cat girl, blue hair, glasses, shy')"
                                        value={getDisplayText()}
                                        onChange={(e) => {
                                            // When user types, update description
                                            // Remove existing tags from the text to avoid duplication
                                            const newText = e.target.value;
                                            const tagsText = selectedTags.join(', ');

                                            if (newText.endsWith(', ' + tagsText)) {
                                                // User is at the end, just update description part
                                                setDescription(newText.slice(0, -(tagsText.length + 2)));
                                            } else if (newText.includes(tagsText)) {
                                                // Tags are in the middle, extract description
                                                setDescription(newText.replace(', ' + tagsText, '').replace(tagsText + ', ', '').replace(tagsText, ''));
                                            } else {
                                                // No tags in text, just set description
                                                setDescription(newText);
                                            }
                                        }}
                                        rows="4"
                                    />
                                    {/* Selected Tags as Chips (hidden, tags shown in input) */}
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
                                <div className="ai-optimize-toggle">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <span>AI Optimize</span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={aiOptimize}
                                            onChange={(e) => setAiOptimize(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
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

                            {/* Reference Image Upload */}
                            <div className="upload-section">
                                <h3 className="upload-title">Reference Image (Optional)</h3>
                                <p className="upload-subtitle">Upload a portrait image to create a character with a similar face</p>

                                <div className="upload-info">
                                    <span>{uploadedImages.length}/9 images • Max 25MB per file • 50MB total</span>
                                </div>

                                <div className="image-gallery">
                                    {uploadedImages.map((img, index) => (
                                        <div key={index} className="image-preview">
                                            <img src={img.preview} alt={`Upload ${index + 1} `} />
                                            <button
                                                className="remove-image-btn"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {uploadedImages.length < 9 && (
                                        <label className="upload-box">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                multiple
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                            <div className="upload-content">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                </svg>
                                                <span>Add Image</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                className="generate-btn"
                                onClick={handleGenerate}
                                disabled={isGenerating}
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
                                        <span className="cost-badge">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                                            </svg>
                                            -60/550
                                        </span>
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
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: '12px'
                                        }}
                                    />
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
        </div>
    );
};

export default CharGen;
