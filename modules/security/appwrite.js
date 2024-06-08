import {Client, Account} from "appwrite";
import dotenv from 'dotenv';
dotenv.config();

const API_ENDPOINT = process.env.APPWRITE_API_ENDPOINT;
const API_PROJECT_ID = process.env.APPWRITE_API_PROJECT_ID;


const client = new Client();
client
    .setEndpoint(API_ENDPOINT) // Your API Endpoint
    .setProject(API_PROJECT_ID) // Your project ID

const account = new Account(client);


export default {account,client}