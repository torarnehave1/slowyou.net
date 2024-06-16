import subprocess
import re

def get_media_info(file_path):
    process = subprocess.run(['ffmpeg', '-i', file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output = process.stderr.decode()

    # Find the duration using regex
    duration_match = re.search(r'Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})', output)
    if duration_match:
        hours, minutes, seconds = map(float, duration_match.groups())
        total_seconds = hours * 3600 + minutes * 60 + seconds
    else:
        raise ValueError("Could not find duration in ffmpeg output")

    # Find the video codec information using regex
    codec_match = re.search(r'Stream #0:\d+.*Video: ([^,]+)', output)
    if codec_match:
        codec = codec_match.group(1)
    else:
        raise ValueError("Could not find codec information in ffmpeg output")

    # Find the bitrate information using regex
    bitrate_match = re.search(r'bitrate: (\d+ kb/s)', output)
    if bitrate_match:
        bitrate = bitrate_match.group(1)
    else:
        raise ValueError("Could not find bitrate information in ffmpeg output")

    return total_seconds, codec, bitrate

if __name__ == "__main__":
    input_file = r"C:\Users\torar\MyApps\slowyou.net\slowyou.net\public\videos\MindBodyConnection.mp4"

    try:
        total_seconds, codec, bitrate = get_media_info(input_file)
        print(f"File: {input_file}")
        print(f"Duration: {total_seconds} seconds")
        print(f"Codec: {codec}")
        print(f"Bitrate: {bitrate}")
    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
