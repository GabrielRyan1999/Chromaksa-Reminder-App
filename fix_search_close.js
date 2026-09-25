const fs = require('fs');
let c = fs.readFileSync('src/components/GlobalSearch.tsx', 'utf8');

c = c.replaceAll('onClick={() => setIsOpen(false)}', 'onClick={() => { setIsOpen(false); setQuery(""); }}');

fs.writeFileSync('src/components/GlobalSearch.tsx', c);
console.log("Success");
