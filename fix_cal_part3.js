const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const startStr = '  const CustomDayButton = (props: any) => {';
const endStr = '  return (\n    <aside className="w-[85vw] max-w-[340px] shrink-0 border-r border-[var(--color-brand-graphite)] border-opacity-20 flex flex-col h-full bg-[var(--color-background)]">';

const startIdx = c.indexOf(startStr);
const endIdx = c.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  c = c.substring(0, startIdx) + c.substring(endIdx);
} else {
  console.log("Not found", startIdx, endIdx);
}

fs.writeFileSync('src/components/Sidebar.tsx', c);
