const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy_FAKE");
    try {
        const model = genAI.getGenerativeModel({
            model: 'imagen-3.0-generate-001',
            generationConfig: { responseModalities: ["IMAGE"] }
        }, { apiVersion: "v1" });
        const result = await model.generateContent("A cat");
        console.log("Success:", result);
    } catch (e) {
        console.error("Error with imagen-3.0-generate-001:", e.message);
    }
}
test();
