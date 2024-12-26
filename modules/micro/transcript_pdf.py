import os
import sys
import json
import xhtml2pdf.pisa as pisa
from functools import reduce
from youtube_transcript_api import YouTubeTranscriptApi

# 14052024
#Tor Arne Haave
#Micro
#Transcript PDF
#https://github.com/Noroff-SWE-22F/14052024/blob/main/Transcript%20PDF.py

#This script is used to generate a PDF transcript of a YouTube video. It uses the YouTubeTranscriptApi to retrieve the transcript of the video and then converts it to a JSON formatted string. The JSON string is then passed to the printPdf function which wraps the text and generates a PDF file. The PDF file is saved in the
# Run the code with python transcript_pdf.py gL4j-a-g9pA
# gL4j-a-g9pA = Example youtubevideoID
#https://youtu.be/gL4j-a-g9pA?si=mFWjqxF2qGdJIdzf

def wrap(text, width):
    """Wrap text for better formatting in PDF."""
    return reduce(lambda line, word, width=width: '%s%s%s' %
                  (line,
                   ' \n'[(len(line)-line.rfind('\n')-1
                         + len(word.split('\n', 1)[0]
                              ) >= width)],
                   word),
                  text.split(' ')
                  )

def printPdf(text, filename):
    """Generate PDF from text and save to a file."""
    text = wrap(text, 100)
    with open(filename, "wb") as f:
        pisa.CreatePDF(text, f)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <video_id>", file=sys.stderr)
        sys.exit(1)

    video_id = sys.argv[1]  # Get video ID from command-line arguments

    script_dir = os.path.dirname(__file__)  # Get the directory containing the script
    filename = os.path.join(script_dir, '..', '..', 'public', 'pdf_video_transcripts', f"{video_id}.pdf")  # Set the output PDF filename in the parallel directory

    print(f"Script directory: {script_dir}")
    print(f"Output PDF filename: {filename}")

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        json_output = json.dumps(transcript, indent=4)  # Convert to JSON formatted string
        print("Transcript retrieved successfully")
        printPdf(json_output, filename)  # Call the function to create PDF
        print("PDF created successfully")
        print(json_output)  # Print the JSON output to be captured by Node.js
    except Exception as e:
        print("Failed to retrieve or convert transcript:", str(e), file=sys.stderr)
        sys.exit(1)
