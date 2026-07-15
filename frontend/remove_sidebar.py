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
    
    if 'SidebarTrigger' in content:
        # Remove import { SidebarTrigger } from ...
        content = re.sub(r'import\s*\{\s*[^}]*SidebarTrigger[^}]*\}\s*from\s*["\']@/components/ui/sidebar["\'];?\n?', '', content)
        
        # Sometimes it's imported with other things, so let's handle that by just removing SidebarTrigger from the import
        content = re.sub(r',\s*SidebarTrigger', '', content)
        content = re.sub(r'SidebarTrigger\s*,?', '', content)
        
        # Remove empty imports
        content = re.sub(r'import\s*\{\s*\}\s*from\s*["\']@/components/ui/sidebar["\'];?\n?', '', content)
        
        # Remove <SidebarTrigger />
        content = re.sub(r'<SidebarTrigger[^>]*/>', '', content)
        
        # We might also want to remove the Separator if it's right next to it:
        # <Separator orientation="vertical" className="mr-2 h-4" />
        # Let's just remove `<Separator orientation="vertical"[^>]*/>`
        content = re.sub(r'<Separator\s+orientation="vertical"[^>]*/>', '', content)
        
        with open(file, 'w') as f:
            f.write(content)
