import pkg from 'cohere-ai';
const { CohereClient } = pkg;

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || 'dummy-key'  // Fallback for development
});

// Function to detect errors and suggest corrections
export const detectErrors = async (text) => {
    try {
        const response = await cohere.chat({
            message: `Analyze the following text for errors and provide corrections:\n\n${text}`,
            model: 'command',
            temperature: 0.3,
            maxTokens: 200
        });

        return response.text;
    } catch (error) {
        console.error('Error detecting errors:', error);
        throw error;
    }
};
