export default async function refinePrompt(prompt) {
    try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

        const response = await fetch(`${BACKEND_URL}/api/refine-prompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            console.error('Backend error:', errorData);
            throw new Error(`Failed to refine prompt: ${errorData.detail || response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Refined prompt:', data.refined_prompt);
        return data.refined_prompt;
    } catch (error) {
        console.error('AI Optimize error:', error);
        // Return original prompt if refinement fails
        return prompt;
    }
};
