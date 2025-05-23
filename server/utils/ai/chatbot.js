import pkg from 'cohere-ai';
const { CohereClient } = pkg;

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || 'dummy-key'  // Fallback for development
});

// Function to generate AI response
export const generateChatResponse = async (message) => {
    try {
        const response = await cohere.chat({
            message: message,
            model: 'command',      // Cohere's model type (you can choose others)
            temperature: 0.7,      // Controls randomness in the response
            maxTokens: 300         // Max number of tokens in the response
        });

        return response.text;  // Return the AI-generated text
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
};
