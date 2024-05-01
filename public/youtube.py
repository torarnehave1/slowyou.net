from youtube_transcript_api import YouTubeTranscriptApi

video_id = 'jANxd6YGdAA'  # replace with your YouTube video ID

transcript = YouTubeTranscriptApi.get_transcript(video_id)

print(transcript)