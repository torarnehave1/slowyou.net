import os

def generate_folder_structure(directory, indent_level=0):
    tree = ""
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isdir(item_path):
            tree += "    " * indent_level + "- " + item + "\n"
            tree += generate_folder_structure(item_path, indent_level + 1)
        else:
            tree += "    " * indent_level + "- " + item + "\n"
    return tree

def write_folder_structure_to_markdown(directory, output_file):
    with open(output_file, "w") as file:
        file.write("# Folder Structure\n\n")
        file.write(generate_folder_structure(directory))

# Specify the directory to analyze

directory_path = r"C:/Users/torar/MyApps/slowyou.net"


# Specify the output file for the Markdown structure
output_file_path = "folder_structure.md"

# Generate and write the folder structure in Markdown format
write_folder_structure_to_markdown(directory_path, output_file_path)