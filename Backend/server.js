import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';

import { GoogleGenAI } from '@google/genai';
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use('/api', chatRoutes);


const ai = new GoogleGenAI({}); 
const connectDB=async () => {//mongodb is async so that it takes time to connect
    try{await mongoose.connect(process.env.MONGODB_URL);// Connect to MongoDB database
    console.log("Connected to MongoDB");
    }catch(error){
        console.error("Database connection failed:", error.message);
    }
}
// app.post('/generate', async (req, res) => {
//     // const options = {
//     //     method: 'POST',
//     //     headers: {
//     //         'Content-Type': 'application/json',
//     //         'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
//     //     },
//     //     body: JSON.stringify({
//     //         model: "gemini-2.5-flash",
//     //         messages: [{ role: "user", content: req.body.query }],
//     //     }),
//     // };
//     try {
//         // Get the user's query from the frontend request body
//         const { query } = req.body; 

//         if (!query) {
//             return res.status(400).send({ error: 'Query parameter is required' });
//         }

//         console.log(`Received query: ${query}`);

//         // 2. Call the Gemini API with the received query
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: query,
//         });
// console.log(`Gemini API response: ${response.text}`);
//         // 3. Send the model's text response back to the frontend
//         res.json({ result: response.text });

//     } catch (error) {
//         console.error("Gemini API Error:", error);
//         res.status(500).json({ error: 'Failed to communicate with the AI model.' });
//     }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  connectDB();
});