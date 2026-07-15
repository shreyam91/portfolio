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

    # Fix the broken import
    content = content.replace(
        'import React\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";\n, { useState, useEffect } from "react";',
        'import React, { useState, useEffect } from "react";\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";'
    )
    content = content.replace(
        'import React\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";\n, { useState } from "react";',
        'import React, { useState } from "react";\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";'
    )
    content = content.replace(
        'import React\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";\n from "react";',
        'import React from "react";\nimport { DashboardNavbar } from "@/components/shared/DashboardNavbar";'
    )

    with open(file, 'w') as f:
        f.write(content)
