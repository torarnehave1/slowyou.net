import express from "express";
import { Octokit } from "@octokit/core";


const accessToken = process.env.ACCESS_TOKEN;
const owner = process.env.OWNER;
const repo = process.env.REPO;

const router = express.Router();

// Define the route for fetching issues
router.get("/test", async (req, res) => {
    res.send("test")
})


router.get("/issues", async (req, res) => {
  const octokit = new Octokit({
    auth:accessToken , // Replace with your actual access token
  });

  try {
    const data = await octokit.paginate("GET /repos/torarnehave1/slowyouGPT/issues", {
      owner:owner,
      repo:repo,
      per_page: 100,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Error fetching issues" });
  }
});


router.get("/issue-titles", async (req, res) => {
    const octokit = new Octokit({
      auth: process.env.ACCESS_TOKEN, // Access token from environment variable
    });
  
    try {
      const response = await octokit.request(
        `GET /repos/${owner}/${repo}/issues`,
        {
          per_page: 100,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
  
      const issues = response.data;
      const issueTitles = issues.map((issue) => issue.title);
  
      res.json(issueTitles);
    } catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({ error: "Error fetching issues" });
    }
  });
  
  export default router;