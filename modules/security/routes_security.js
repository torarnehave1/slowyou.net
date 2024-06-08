import express from "express";
import axios from "axios";
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

const API_ENDPOINT = process.env.API_ENDPOINT;
const API_PROJECT_ID = process.env.PROJECT_ID;

if (!API_ENDPOINT || !API_PROJECT_ID) {
    console.error("Missing necessary environment variables. Please check your .env file.");
    process.exit(1); // Exit the application if environment variables are not set
}
router.get("/appwrite", async (req, res) => {
    try {
        // Making a request to the health endpoint to test the connection
        const healthEndpoint = `${API_ENDPOINT}/health`;
        const response = await axios.get(healthEndpoint, {
            headers: {
                'X-Appwrite-Project': API_PROJECT_ID
            }
        });

        if (response.status === 200) {
            res.send("Connected to the API endpoint successfully");
        } else {
            res.status(response.status).send("Failed to connect to the API endpoint");
        }
    } catch (error) {
        console.error("Error connecting to the API endpoint:", error);
        res.status(500).send("Error connecting to the API endpoint: " + error.message);
    }
});

export default router;
