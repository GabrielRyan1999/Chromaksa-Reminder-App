const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const startStr = '  const CustomDayButton = (props: any) => {';
const endStr = '  return (';

const startIdx = c.indexOf(startStr);
const endIdx = c.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  c = c.substring(0, startIdx) + c.substring(endIdx);
  fs.writeFileSync('src/components/Sidebar.tsx', c);
  console.log("Success");
} else {
  console.log("Not found", startIdx, endIdx);
}
