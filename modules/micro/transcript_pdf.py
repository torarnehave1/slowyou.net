# 14052024
#Tor Arne Haave
#Micro
#Transcript PDF
#https://github.com/Noroff-SWE-22F/14052024/blob/main/Transcript%20PDF.py

#This script is used to generate a PDF transcript of a YouTube video. It uses the YouTubeTranscriptApi to retrieve the transcript of the video and then converts it to a JSON formatted string. The JSON string is then passed to the printPdf function which wraps the text and generates a PDF file. The PDF file is saved in the
# Run the code with python transcript_pdf.py gL4j-a-g9pA
# gL4j-a-g9pA = Example youtubevideoID
#https://youtu.be/gL4j-a-g9pA?si=mFWjqxF2qGdJIdzf

import os
import sys
import json
import requests
import xhtml2pdf.pisa as pisa
from functools import reduce
from youtube_transcript_api import YouTubeTranscriptApi, ProxyError
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
    filename = os.path.join(script_dir, '..', '..', 'public', 'pdf_video_transcripts', f"{video_id}.pdf")  # Set the output PDF filename in the parallel directory

    print(f"Script directory: {script_dir}")
    print(f"Output PDF filename: {filename}")

    proxies = {
        "http": "http://localhost:8888",
        "https": "http://localhost:8888",
    }

    # Test proxy configuration
    try:
        response = requests.get("http://youtube.com", proxies=proxies, timeout=5)
        if response.status_code == 200:
            print("Proxy is working.")
    except Exception as e:
        print(f"Proxy test failed: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, proxies=proxies)
        json_output = json.dumps(transcript, indent=4)  # Convert to JSON formatted string
        print("Transcript retrieved successfully")
        printPdf(json_output, filename)  # Call the function to create PDF
        print("PDF created successfully")
        print(json_output)  # Print the JSON output to be captured by Node.js
    except ProxyError as e:
        print("Proxy error: Unable to connect through the configured proxy.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Failed to retrieve or convert transcript for video ID {video_id}: {e}", file=sys.stderr)
        sys.exit(1)
