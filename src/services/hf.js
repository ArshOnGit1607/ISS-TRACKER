import { HfInference } from "@huggingface/inference";

const MODEL = "Qwen/Qwen2.5-72B-Instruct";

export const askMistral = async (systemPrompt, userText, apiKey) => {
  if (!apiKey) {
    throw new Error('Hugging Face API key is missing. Please add VITE_HF_API_KEY to your .env file.');
  }

  const hf = new HfInference(apiKey);

  try {
    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText }
      ],
      max_tokens: 150,
      temperature: 0.2,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("HF API Error:", error);
    if (error.httpResponse && error.httpResponse.status === 503) {
        throw new Error('The AI model is currently loading. Please try again in a moment.');
    }
    throw new Error('Failed to connect to the AI service. The model might be temporarily unavailable.');
  }
};
