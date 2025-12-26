import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Storyboard from '../Story/StoryBoard';
import '../Css/ProfilePage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, storyId: null, storyTitle: '' });
    const [viewingStory, setViewingStory] = useState(null);
    const [loadingStory, setLoadingStory] = useState(false);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/me`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, []);

    // Fetch user stories
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/story/list`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setStories(data);
                }
            } catch (error) {
                console.error('Failed to fetch stories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const handleDeleteClick = (storyId, storyTitle) => {
        setDeleteModal({ show: true, storyId, storyTitle });
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/story/${deleteModal.storyId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                // Remove deleted story from state
                setStories(stories.filter(story => story.id !== deleteModal.storyId));
                setDeleteModal({ show: false, storyId: null, storyTitle: '' });
            } else {
                alert('Failed to delete story');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete story');
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, storyId: null, storyTitle: '' });
    };

    const handleViewStory = async (storyId) => {
        setLoadingStory(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/story/${storyId}`, {
                credentials: 'include',
            });

            if (response.ok) {
                const storyData = await response.json();
                setViewingStory(storyData);
            } else {
                alert('Failed to load story');
            }
        } catch (error) {
            console.error('Failed to fetch story:', error);
            alert('Failed to load story');
        } finally {
            setLoadingStory(false);
        }
    };

    const handleCloseStory = () => {
        setViewingStory(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="profile-page">
            {/* Header */}
            <header className="profile-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    Back to Home
                </button>
                <h1>My Profile</h1>
            </header>

            {/* Profile Info Section */}
            <div className="profile-container">
                <div className="profile-info-card">
                    <div className="profile-avatar">
                        {userData?.picture ? (
                            <img src={userData.picture} alt={userData.name} />
                        ) : (
                            <div className="avatar-placeholder">
                                {userData?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="profile-details">
                        <h2>{userData?.name}</h2>
                        <p className="username">@{userData?.user_name}</p>
                        <p className="email">{userData?.email}</p>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-value">{stories.length}</span>
                                <span className="stat-label">Stories Created</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stories Section */}
                <div className="stories-section">
                    <div className="section-header">
                        <h2>My Stories</h2>
                        <button className="create-story-btn" onClick={() => navigate('/')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Create New Story
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loader-spinner"></div>
                            <p>Loading your stories...</p>
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📚</div>
                            <h3>No stories yet</h3>
                            <p>Start creating your first manga story!</p>
                            <button className="create-first-btn" onClick={() => navigate('/')}>
                                Create Your First Story
                            </button>
                        </div>
                    ) : (
                        <div className="stories-grid">
                            {stories.map((story) => (
                                <div key={story.id} className="story-card">
                                    <div className="story-card-header">
                                        <h3>{story.title}</h3>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteClick(story.id, story.title)}
                                            title="Delete Story"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="story-genres">
                                        {story.genre.slice(0, 3).map((genre, idx) => (
                                            <span key={idx} className="genre-tag">{genre}</span>
                                        ))}
                                        {story.genre.length > 3 && (
                                            <span className="genre-tag">+{story.genre.length - 3}</span>
                                        )}
                                    </div>
                                    <div className="story-footer">
                                        <span className="story-date">{formatDate(story.created_at)}</span>
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewStory(story.id)}
                                            disabled={loadingStory}
                                        >
                                            {loadingStory ? 'Loading...' : 'View Story'}
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">⚠️</div>
                        <h3>Delete Story?</h3>
                        <p>Are you sure you want to delete "<strong>{deleteModal.storyTitle}</strong>"?</p>
                        <p className="warning-text">This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Story Viewer Modal */}
            {viewingStory && (
                <Storyboard
                    onClose={handleCloseStory}
                    initialStoryData={viewingStory}
                    viewOnly={true}
                />
            )}
        </div>
    );
};

export default ProfilePage;
