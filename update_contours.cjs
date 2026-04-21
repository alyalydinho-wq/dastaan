const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

// Increase border contrast
content = content.replace(/border-gray-200/g, 'border-gray-300');

// Improve container shadows (makes it stand out more distinctively)
content = content.replace(/shadow-2xl/g, 'shadow-[0_10px_40px_rgba(0,0,0,0.1)]');
content = content.replace(/shadow-xl/g, 'shadow-[0_8px_30px_rgba(0,0,0,0.08)]');
content = content.replace(/bg-white border border-gray-300 p-6 rounded-3xl/g, 'bg-white border border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 rounded-3xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]');

// Slightly darker background for the outermost input fields? Actually just the grey 300 border is enough to make them pop

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log('Contours updated.');
