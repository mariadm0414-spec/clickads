const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy_FAKE");
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: { responseModalities: ["IMAGE"] }
        }, { apiVersion: "v1beta" });
        const result = await model.generateContent("A cat");
        console.log("Success:", result);
    } catch (e) {
        console.error("Error with gemini-1.5-flash:", e.message);
    }
}
test();
