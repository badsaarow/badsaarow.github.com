import re
import glob# Define the pattern
pattern = r'\[\!\[신고\].*'# Get a list of all markdown files
files = glob.glob('*.md')

for file_name in files:
    # Read the file
    with open(file_name, 'r', encoding='utf-8') as file:
        content = file.read()

    # Replace the pattern with an empty string
    new_content = re.sub(pattern, '', content, flags=re.DOTALL)

    # Write the new content back to the file
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(new_content)
