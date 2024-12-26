# 14052024
# Tor Arne Haave
# Micro
# Transcript PDF
# https://github.com/Noroff-SWE-22F/14052024/blob/main/Transcript%20PDF.py

# This script is used to generate a PDF transcript of a YouTube video.
# It retrieves the transcript, converts it to JSON, and generates a PDF.
# Run with: python transcript_pdf.py <YouTubeVideoID>
# Example: python transcript_pdf.py gL4j-a-g9pA

import os
import sys
import json
import requests
import xhtml2pdf.pisa as pisa
from functools import reduce
from youtube_transcript_api import YouTubeTranscriptApi
import logging

logging.basicConfig(level=logging.INFO)

def wrap(text, width):
    """Wrap text for better formatting in PDF."""
    return reduce(lambda line, word, width=width: '%s%s%s' %
                  (line,
                   ' \n'[(len(line)-line.rfind('\n')-1
                          + len(word.split('\n', 1)[0]
                             ) >= width)],
                   word),
                  text.split(' '))

def printPdf(text, filename):
    """Generate PDF from text and save to a file."""
    text = wrap(text, 100)
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "wb") as f:
        pisa.CreatePDF(text, f)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcript_pdf.py <video_id>", file=sys.stderr)
        sys.exit(1)

    video_id = sys.argv[1]  # Get video ID from command-line arguments

    script_dir = os.path.dirname(__file__)  # Get the directory containing the script
    filename = os.path.join(script_dir, '..', '..', 'public', 'pdf_video_transcripts', f"{video_id}.pdf")  # Set the output PDF filename

    print(f"Script directory: {script_dir}")
    print(f"Output PDF filename: {filename}")

    # Note: Proxy settings are defined but not used in the exception handling anymore.
    # You can remove them if you are not planning to handle proxy errors specifically.
    proxies = {
        "http": "http://localhost:3000",
        "https": "http://localhost:3000",
    }

    # Test proxy configuration (Optional, you can remove this if you don't need to test the proxy)
    try:
        response = requests.get("http://youtube.com", proxies=proxies, timeout=5)
        if response.status_code == 200:
            print("Proxy is working.")
    except Exception as e:
        print(f"Proxy test failed: {e}", file=sys.stderr)
        # If you remove the proxy test, also remove the sys.exit(1) here

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, proxies=proxies)
        json_output = json.dumps(transcript, indent=4)  # Convert to JSON formatted string
        print("Transcript retrieved successfully")
        printPdf(json_output, filename)  # Call the function to create PDF
        print("PDF created successfully")
        print(json_output)  # Print the JSON output
    except Exception as e:
        print(f"Failed to retrieve or convert transcript for video ID {video_id}: {e}", file=sys.stderr)
        sys.exit(1)