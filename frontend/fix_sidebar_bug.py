import os
import re

files_to_check = []
for root, _, files in os.walk('/Users/shreyam/folder/portfolio/frontend'):
    if 'node_modules' in root or '.next' in root or '.git' in root:
        continue
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            files_to_check.append(os.path.join(root, f))

for file in files_to_check:
    with open(file, 'r') as f:
        content = f.read()
    
    # Remove leftover invalid tags like <className="..." /> or < className="..." />
    new_content = re.sub(r'<\s*className="[^"]*"\s*/>', '', content)
    
    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Fixed {file}")
