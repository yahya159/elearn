import pkg from 'cohere-ai';
const { CohereClient } = pkg;

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || 'dummy-key'  // Fallback for development
});

export const detectFraud = async (activity) => {
    try {
        const response = await cohere.chat({
            message: `Analyze the following user activity for potential fraudulent behavior:\n\n${JSON.stringify(activity)}`,
            model: 'command',
            temperature: 0.3,
            maxTokens: 200
        });

        const analysis = response.text;
        const riskLevel = calculateRiskLevel(analysis);

        return {
            analysis,
            riskLevel,
            isHighRisk: riskLevel > 0.7
        };
    } catch (error) {
        console.error('Error detecting fraud:', error);
        throw error;
    }
};

const calculateRiskLevel = (analysis) => {
    const riskIndicators = [
        { term: 'high risk', weight: 0.9 },
        { term: 'suspicious', weight: 0.8 },
        { term: 'unusual', weight: 0.6 },
        { term: 'potential', weight: 0.4 },
        { term: 'normal', weight: 0.1 }
    ];

    const lowerAnalysis = analysis.toLowerCase();
    let maxWeight = 0;

    for (const indicator of riskIndicators) {
        if (lowerAnalysis.includes(indicator.term)) {
            maxWeight = Math.max(maxWeight, indicator.weight);
        }
    }

    return maxWeight;
}; 