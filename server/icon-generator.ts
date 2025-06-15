import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateToolIcon(toolName: string, toolDescription: string): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a simple, clean, professional icon for a web tool called "${toolName}". The tool ${toolDescription}. Style: minimalist, flat design, single color on transparent background, suitable for web interface, 64x64px optimized. No text or words in the icon.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || '';
  } catch (error) {
    console.error('Error generating icon:', error);
    return '';
  }
}

export async function generateCategoryIcon(categoryName: string, categoryDescription: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3", 
      prompt: `Create a simple, clean, professional category icon for "${categoryName}". This category contains ${categoryDescription}. Style: minimalist, flat design, single color on transparent background, suitable for web interface, 64x64px optimized. No text or words in the icon.`,
      n: 1,
      size: "1024x1024", 
      quality: "standard",
    });

    return response.data[0].url || '';
  } catch (error) {
    console.error('Error generating category icon:', error);
    return '';
  }
}