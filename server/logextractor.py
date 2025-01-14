import re

with open("log.txt", "r") as file:
    log_content = file.read()

missing_files = re.findall(r"GET (http://localhost[^\s]+) (?:404|net::ERR_ABORTED)", log_content)

unique_missing_files = sorted(set(missing_files))
for file in unique_missing_files:
    print(file)
