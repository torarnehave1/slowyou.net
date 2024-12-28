import os
import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi

# 14052024
# Tor Arne Haave
# Micro
# Transcript Markdown
# This script retrieves a YouTube transcript and saves it as a Markdown file.
# Usage: python transcript_markdown.py <video_id>
# Example: python transcript_markdown.py gL4j-a-g9pA

def format_markdown(transcript):
    """
    Format the YouTube transcript into Markdown with timestamps.

    :param transcript: List of transcript entries.
    :return: A string containing the formatted Markdown.
    """
    markdown = []
    for entry in transcript:
        timestamp = convert_to_hh_mm_ss(entry['start'])
        markdown.append(f"**[{timestamp}]** {entry['text']}")
    return '\n\n'.join(markdown)

def convert_to_hh_mm_ss(seconds):
    """
    Convert seconds to HH:mm:ss format.

    :param seconds: Time in seconds.
    :return: A string in HH:mm:ss format.
    """
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02}:{m:02}:{s:02}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <video_id>", file=sys.stderr)
        sys.exit(1)

    video_id = sys.argv[1]  # Get video ID from command-line arguments

    # Set the output Markdown filename
    script_dir = os.path.dirname(__file__)  # Get the directory containing the script
    filename = os.path.join(script_dir, '..', '..', 'public', 'markdown_video_transcripts', f"{video_id}.md")

    try:
        # Retrieve the transcript from YouTube
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en-GB', 'en'])

        # Format the transcript into Markdown
        markdown_content = format_markdown(transcript)

        # Save the Markdown content to a file
        os.makedirs(os.path.dirname(filename), exist_ok=True)  # Ensure the directory exists
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

      #  print(f"Markdown file saved at: {filename}")  # Indicate success
        print(markdown_content)  # Print the Markdown output to be captured by Node.js

    except Exception as e:
        print("Failed to retrieve or convert transcript:", str(e), file=sys.stderr)
        sys.exit(1)
