import re
import os

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

    # Match:
    # import React
    # import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
    # , { useState, ... } from "react";
    #
    # We want to replace it with:
    # import React, { useState, ... } from "react";
    # import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
    
    # Let's use a regex
    pattern = r'import React\nimport \{ DashboardNavbar \} from "@/components/shared/DashboardNavbar";\n(, \{[^}]+\} from "react";)'
    replacement = r'import React\1\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Fixed {file}")
