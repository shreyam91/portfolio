const fs = require('fs');
const path = require('path');

const dirsToProcess = ['app'];

const walkSync = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && filepath.endsWith('page.tsx')) {
      callback(filepath);
    }
  }
};

dirsToProcess.forEach(dir => {
  walkSync(path.join(__dirname, dir), (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Check if it's a dynamic route page with params
    if (content.includes('params }: { params: { id: string } }') || content.includes('params}: {params: {id: string}}')) {
      // Replace the signature
      content = content.replace(/params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*id\s*:\s*string\s*\}\s*\}/g, 'params }: { params: Promise<{ id: string }> }');
      
      // Update useEffect to await params
      if (filepath.includes('blogs')) {
        content = content.replace(/const found = data\.find\(\(b: any\) => b\.id === params\.id \|\| b\._id === params\.id\);/,
          'const resolvedParams = await params;\n        const found = data.find((b: any) => b.id === resolvedParams.id || b._id === resolvedParams.id);');
        content = content.replace(/\[params\.id\]/g, '[params]');
      } else {
        content = content.replace(/params\.id/g, '(await params).id');
        // Actually for the other ones, let's just do a blanket replace inside useEffect
      }

      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated params to Promise in ${filepath}`);
    }
  });
});
