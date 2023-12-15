import re
import glob# Define the pattern
pattern = r'- \[badsaarow\.egloos\.com/\d+\]\(../\d+\.html\)\n- 덧글수 : \d+\n'# Get a list of all markdown files
files = glob.glob('*.md')

for file_name in files:
    # Read the file
    with open(file_name, 'r', encoding='utf-8') as file:
        content = file.read()

    # Replace the pattern with an empty string
    new_content = re.sub(pattern, '', content)

    # Write the new content back to the file
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(new_content)
