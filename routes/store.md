 const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN_ISSUES  // Ensure your access token is correctly loaded from environment variables
    });

    try {
        // Send a POST request to create an issue
        const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
            owner: 'torarnehave1',  // Replace 'torarnehave1' with your GitHub username or organization name
            repo: 'slowyouGPT',     // Replace 'slowyouGPT' with your repository name
            title: title,  // Your issue title
            body: body,  // Your issue body content
            labels: [],
          });
  
        // Send the issue URL back as a response
        res.json({ issueUrl: response.data.html_url });
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ error: 'Error creating issue', details: error.message });
    }