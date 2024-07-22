import express from 'express';
import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/list-files', async (req, res) => {
  const folderPath = '/Slowyou.net/Images'; // Root directory
  console.log(`Requesting path: ${folderPath}`); // Log the path being requested

  const dbx = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    fetch: fetch,
  });

  try {
    const response = await dbx.filesListFolder({ path: folderPath });
    const entries = response.result.entries.map(entry => ({
      name: entry.name,
      type: entry['.tag'],
    size: entry.size,
    modified: entry.server_modified,
    path: entry.path_display
    }));

    res.json(entries);
  } catch (error) {
    console.error('Error fetching files from Dropbox:', error);
    res.status(500).json({
      message: 'Error fetching files from Dropbox',
      error: error.error ? error.error.error_summary : error.message
    });
  }
});

export default router;
