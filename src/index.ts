import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert waste classification system. Analyze the user-provided image of a waste item.
Your response MUST be a valid JSON object and nothing else. Do not add any introductory text, comments, or markdown formatting.
The JSON object must have the following structure:
{
  "itemName": "A descriptive name of the item, e.g., 'Crushed Aluminum Soda Can'",
  "category": "One of: 'recyclable', 'organic', 'landfill', 'hazardous'",
  "confidence": "A number between 0 and 1 representing your confidence in the classification.",
  "recyclable": "A boolean value (true/false).",
  "greenPoints": "An integer representing the environmental value. Hazardous=40, Recyclable=15, Organic=10, Landfill=5.",
  "binType": "The recommended disposal bin, e.g., 'Blue Recycling Bin (Plastics & Cans)' or 'Red Hazard / E-Waste Depot Bin'.",
  "disposalInstructions": "A short, actionable instruction for the user on how to dispose of the item correctly.",
  "materialsDetected": "An array of strings listing detected materials, e.g., ['Aluminum', 'Paint'].",
  "co2SavedKg": "An estimated CO2 saving in kilograms if disposed of correctly. Provide a numeric value."
}
If the image is not clear or does not contain a waste item, set the confidence to a low value and categorize it as 'landfill'.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageBase64, presetId } = await req.json();
    if (!imageBase64 && !presetId) {
      throw new Error('Either imageBase64 or presetId is required.');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: presetId
                  ? `Analyze the waste item described as: '${presetId}' and provide the classification JSON.`
                  : "Analyze this image and provide the waste classification JSON."
              },
              ...(imageBase64 ? [{ type: "image_url", image_url: { url: imageBase64 } }] : []),
            ],
          },
        ],
        model: "llava-v1.5-7b-hf",
        temperature: 0,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errorBody}`);
    }

    const chatCompletion = await response.json();
    const jsonResponse = chatCompletion.choices[0]?.message?.content;
    
    if (!jsonResponse) throw new Error("AI model did not return a valid response.");

    const result = JSON.parse(jsonResponse);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});