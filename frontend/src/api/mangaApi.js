const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const mangaApi = {
    suggestAction: async (data) => {
        const response = await fetch(`${BASE_URL}/api/manga/suggest-action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Failed to suggest action' }));
            throw new Error(error.detail || 'Failed to suggest action');
        }
        return response.json();
    },

    generatePanelPrompt: async (data) => {
        const response = await fetch(`${BASE_URL}/api/manga/generate-panel-prompt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Failed to generate prompt' }));
            throw new Error(error.detail || 'Failed to generate prompt');
        }
        return response.json();
    },

    generatePanelImage: async (data) => {
        const response = await fetch(`${BASE_URL}/api/manga/generate-panel-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Failed to generate image' }));
            throw new Error(error.detail || 'Failed to generate image');
        }
        return response.json();
    }
};
