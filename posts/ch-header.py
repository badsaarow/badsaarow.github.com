import os
import re
from datetime import datetime

# Step 1: Find all .md files
for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(".md"):
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                lines = f.readlines()

            title = lines[0][3:]
            # Step 2: Convert line 1 to code block
            lines[0] = '---\n' + 'layout: post\n' + 'title: ' + title + ''

            # Step 3: Convert datetime format in line 4
            match = re.search(r'(\d{4}/\d{2}/\d{2} \d{2}:\d{2})', lines[3])
            if match:
                dt = datetime.strptime(match.group(1), '%Y/%m/%d %H:%M')
                # published_time: 2022-01-01T12:00:00.000Z
                lines[1] = 'published_time: ' + dt.strftime('%Y-%m-%dT%H:%M:%S.000Z')

            lines[3] = '---\n'
            # Step 4: Copy line 1 to line 5
            lines.insert(4, '\n# ' + title)

            # Step 5: Write the changes back to the file
            with open(os.path.join(root, file), 'w', encoding='utf-8') as f:
                f.writelines(lines)
