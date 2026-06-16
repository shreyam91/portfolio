const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx') && file !== 'layout.tsx' && fullPath !== 'frontend/app/dashboard/page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/^\s*<ProtectedRoute>\s*$/gm, '');
            content = content.replace(/^\s*<SidebarProvider>\s*$/gm, '');
            content = content.replace(/^\s*<AppSidebar \/>\s*$/gm, '<>');
            content = content.replace(/^\s*<SidebarInset>\s*$/gm, '');
            content = content.replace(/^\s*<\/SidebarInset>\s*$/gm, '');
            content = content.replace(/^\s*<\/SidebarProvider>\s*$/gm, '');
            content = content.replace(/^\s*<\/ProtectedRoute>\s*$/gm, '</>');
            content = content.replace(/^.*import ProtectedRoute from.*$/gm, '');
            content = content.replace(/^.*import { AppSidebar } from.*$/gm, '');
            content = content.replace(/SidebarInset,\s*/g, '');
            content = content.replace(/,\s*SidebarInset/g, '');
            content = content.replace(/SidebarProvider,\s*/g, '');
            content = content.replace(/,\s*SidebarProvider/g, '');
            fs.writeFileSync(fullPath, content);
            console.log('Updated ' + fullPath);
        }
    }
}

processDir('./frontend/app/dashboard');
