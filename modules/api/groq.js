import express from "express";
import Groq from 'groq-sdk';

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});



router.get("/groq", async (req, res) => {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Can I use langchain with groq?"
            }
        ],
        model: "llama3-8b-8192"
    });

    res.send(chatCompletion.choices[0]?.message?.content || "");
});


router.get("/test", (req, res) => {
    res.send("test groq")
}); 

export default router;