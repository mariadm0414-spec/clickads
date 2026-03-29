const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy_FAKE");
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.1-flash-image-preview',
            generationConfig: { responseModalities: ["IMAGE"] }
        }, { apiVersion: "v1beta" });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: "A cat" }] }]
        });
        console.log("Success:", result);
    } catch (e) {
        console.error("Error with gemini-3.1-flash-image-preview:", e.message);
    }
}
test();
