#!/bin/bash

# Replace this with the directory containing your HTML files
html_directory="./page"

# Replace this with the directory where you want to save the Markdown files
md_directory="./md"

# Loop through all HTML files in the html_directory
for html_file in "$html_directory"/*.html; do
  # Convert the HTML file to a Markdown file using html2md
  bfile=$(basename "${html_file%.*}.html")
  #md_file="${md_directory}/${basename "${html_file%.*}.html"}.md"
  md_file="${md_directory}/${bfile}.md"
  html2md -i "$html_file"  > "$md_file"
done
