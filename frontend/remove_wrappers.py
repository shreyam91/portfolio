import os
import re

dashboard_dir = 'frontend/app/dashboard'

for root, _, files in os.walk(dashboard_dir):
    for file in files:
        if file.endswith('.tsx') and file != 'layout.tsx':
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                lines = f.readlines()
            
            new_lines = []
            for line in lines:
                # Remove starting wrappers
                if re.search(r'^\s*<ProtectedRoute>\s*$', line): continue
                if re.search(r'^\s*<SidebarProvider>\s*$', line): continue
                if re.search(r'^\s*<AppSidebar />\s*$', line): continue
                if re.search(r'^\s*<SidebarInset>\s*$', line): continue
                
                # Remove ending wrappers
                if re.search(r'^\s*</SidebarInset>\s*$', line): continue
                if re.search(r'^\s*</SidebarProvider>\s*$', line): continue
                if re.search(r'^\s*</ProtectedRoute>\s*$', line): continue
                
                # Remove unused imports
                if 'import ProtectedRoute from' in line: continue
                if 'import { AppSidebar } from' in line: continue
                
                # For SidebarInset and SidebarProvider, we need to modify the import
                # It usually looks like: import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
                # Regex to handle replacing SidebarInset and SidebarProvider in the import while leaving SidebarTrigger
                if 'SidebarTrigger' in line and 'SidebarProvider' in line:
                    line = re.sub(r'SidebarInset\s*,\s*', '', line)
                    line = re.sub(r',\s*SidebarInset', '', line)
                    line = re.sub(r'SidebarProvider\s*,\s*', '', line)
                    line = re.sub(r',\s*SidebarProvider', '', line)

                # De-indent lines that were inside the wrappers (by 8 spaces or so).
                # Wait, simply leaving the indentation is fine, Prettier or ESLint can fix it later, or I can dedent by 8 spaces.
                # Let's not dedent blindly to avoid breaking <pre> tags or template literals.
                
                new_lines.append(line)
            
            with open(filepath, 'w') as f:
                f.writelines(new_lines)
            print(f"Updated {filepath}")
