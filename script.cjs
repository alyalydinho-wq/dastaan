const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

// Container
content = content.replace(/min-h-screen bg-brand-dark text-brand-offwhite/g, 'min-h-screen bg-white text-black');

// Header
content = content.replace(/border-b border-white\/5 bg-brand-bordeaux-deep\/50 backdrop-blur-xl/g, 'border-b border-gray-200 bg-white/80 backdrop-blur-xl');
content = content.replace(/text-brand-dark shadow-\[0_0_20px_rgba\(212,175,55,0\.3\)\]/g, 'text-white shadow-md');
content = content.replace(/<Logo className="h-4 w-auto" white \/>/g, '<Logo className="h-4 w-auto" />');
content = content.replace(/bg-white\/10/g, 'bg-gray-200');
content = content.replace(/text-brand-gold\/60/g, 'text-gray-500');

// Header Buttons
content = content.replace(/bg-white\/5 border border-white\/5 hover:bg-white\/10/g, 'bg-gray-50 border border-gray-200 hover:bg-gray-100');
content = content.replace(/text-brand-beige\/60/g, 'text-gray-600');
content = content.replace(/text-brand-gold\/80/g, 'text-gray-700');
content = content.replace(/bg-brand-bordeaux\/20 border border-brand-bordeaux\/40 hover:bg-brand-bordeaux/g, 'bg-red-50 border border-red-100 hover:bg-red-100 text-red-600');

// Settings modal
content = content.replace(/bg-brand-dark\/95/g, 'bg-white/95');
content = content.replace(/bg-brand-bordeaux-deep/g, 'bg-gray-50');
content = content.replace(/border-white\/10/g, 'border-gray-200');
content = content.replace(/text-white\/20/g, 'text-gray-400');
content = content.replace(/text-brand-gold/g, 'text-black');
content = content.replace(/bg-brand-dark\/50/g, 'bg-white');
content = content.replace(/text-brand-offwhite/g, 'text-black');

// Right and Left Columns Panels
// We just do global replaces for the remaining instances
content = content.replace(/bg-brand-bordeaux-deep\/40/g, 'bg-white');
content = content.replace(/bg-brand-bordeaux-deep\/30/g, 'bg-gray-50');
content = content.replace(/bg-brand-bordeaux-deep/g, 'bg-gray-50');
content = content.replace(/border-white\/5/g, 'border-gray-200');
content = content.replace(/bg-brand-dark\/50/g, 'bg-white');
content = content.replace(/bg-brand-dark\/30/g, 'bg-gray-50');
content = content.replace(/hover:bg-brand-dark\/50/g, 'hover:bg-gray-100');
content = content.replace(/bg-brand-gold\/5 text-brand-gold\/40 group-hover:text-brand-gold\/60/g, 'bg-gray-100 text-gray-400 group-hover:text-gray-600');
content = content.replace(/bg-brand-gold\/10 text-brand-gold border-brand-gold\/20/g, 'bg-gray-100 text-black border-gray-200');

content = content.replace(/text-brand-beige\/60/g, 'text-gray-600');
content = content.replace(/text-brand-beige\/40/g, 'text-gray-500');
content = content.replace(/text-brand-beige\/30/g, 'text-gray-400');
content = content.replace(/text-brand-beige\/20/g, 'text-gray-400');
content = content.replace(/text-brand-offwhite/g, 'text-black');
content = content.replace(/text-white\/20/g, 'text-gray-400');
content = content.replace(/text-white\/10/g, 'text-gray-400');
content = content.replace(/placeholder:text-white\/10/g, 'placeholder:text-gray-400');

// Buttons / Accents
content = content.replace(/bg-brand-gold text-brand-dark/g, 'bg-black text-white');
content = content.replace(/hover:bg-brand-beige/g, 'hover:bg-gray-800');
content = content.replace(/hover:text-brand-gold/g, 'hover:text-gray-600');
content = content.replace(/focus:border-brand-gold\/50/g, 'focus:border-gray-400');
content = content.replace(/border-brand-gold/g, 'border-gray-900');
content = content.replace(/bg-brand-dark/g, 'bg-gray-100');

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log('Done');
