import re
import glob# Define the pattern and replacement
pattern = r'## \[(.*?)\.html "(.*?)"\) \[(.*?)\.html\)'
replacement = r'# \2'# Get a list of all markdown files
files = glob.glob('*.md')

for file_name in files:
    # Read the file
    with open(file_name, 'r', encoding='utf-8') as file:
        content = file.read()

    # Replace the pattern with the replacement
    new_content = re.sub(pattern, replacement, content)

    # Write the new content back to the file
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(new_content)
