import re

files = [
    '/Users/shreyam/folder/portfolio/frontend/app/codestreak/page.tsx',
    '/Users/shreyam/folder/portfolio/frontend/app/codestreak/blogs/page.tsx',
    '/Users/shreyam/folder/portfolio/frontend/components/shared/system-design-list.tsx',
    '/Users/shreyam/folder/portfolio/frontend/components/shared/machine-coding-list.tsx',
    '/Users/shreyam/folder/portfolio/frontend/components/shared/dsa-universe-explorer.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # 1. Add import if not exists
    if 'DashboardNavbar' not in content:
        content = re.sub(r'import React', 'import React\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";\n', content, count=1)
        # If import React isn't there, just add it after first import
        if 'import { DashboardNavbar }' not in content:
            content = re.sub(r'(import .*?;)', r'\1\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";', content, count=1)

    # 2. Replace the entire <header> block that contains the breadcrumbs.
    # The header starts with <header className="... and ends with </header>
    # We will use re.sub with DOTALL
    content = re.sub(r'<header[^>]*>.*?</header>', '<DashboardNavbar />', content, count=1, flags=re.DOTALL)
    
    with open(file, 'w') as f:
        f.write(content)
    print(f"Updated {file}")
