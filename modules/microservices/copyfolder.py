import shutil
import os

def copy_files(src_folder, dest_folder):
    # Check if source folder exists
    if os.path.exists(src_folder):
        # Iterate through all files in the source folder
        for filename in os.listdir(src_folder):
            # Construct full file path
            src_file = os.path.join(src_folder, filename)
            # Construct destination file path
            dest_file = os.path.join(dest_folder, filename)
            # Copy the file
            shutil.copy2(src_file, dest_folder)
    else:
        print(f"Source folder '{src_folder}' does not exist.")

# Replace 'source_folder' and 'destination_folder' with your desired paths
input_directory = r"C:\Users\torar\Dropbox\2024 - 04"

destination_folder = r"C:\Users\torar\Dropbox\2024\Lydopptak\Enkel Endring"

copy_files(input_directory, destination_folder)