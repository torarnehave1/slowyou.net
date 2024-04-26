import os

# Define the directory structure
dirs = {
    ".": ["node_modules", "public/stylesheets", "views", "routes", "models"],
}

# Define the files to be created
files = {
    "./public/stylesheets": ["style.css"],
    "./views": ["index.ejs"],
    "./routes": ["index.js"],
    "./models": ["db.js"],
}

# Create directories
for parent_dir, sub_dirs in dirs.items():
    for sub_dir in sub_dirs:
        os.makedirs(os.path.join(parent_dir, sub_dir), exist_ok=True)

# Create files
for parent_dir, filenames in files.items():
    for filename in filenames:
        with open(os.path.join(parent_dir, filename), 'w') as f:
            pass