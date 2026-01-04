
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPastoralInsights = async (parishData: any) => {
  try {
    // We create a new instance to ensure we use the latest key and standard config
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `En tant qu'expert en administration paroissiale au Cameroun, analyse ces statistiques : ${JSON.stringify(parishData)}. 
      Fournis 3 recommandations stratégiques concrètes pour :
      - Augmenter l'engagement des jeunes dans les CEV.
      - Améliorer la transparence financière du Denier du Culte.
      - Gérer l'afflux des demandes de sacrements pendant les fêtes.
      Ton ton doit être ecclésiastique, encourageant et très précis sur le plan administratif.`,
      config: {
        systemInstruction: "Tu es l'éminence grise numérique du Curé. Tu maîtrises le droit canonique et les réalités sociales du Cameroun (Yaoundé, Douala, Bafoussam, etc.).",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "L'assistant pastoral rencontre une difficulté technique de connexion. Veuillez réessayer ultérieurement pour obtenir vos analyses.";
  }
};
