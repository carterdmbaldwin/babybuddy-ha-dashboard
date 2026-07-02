const fs = require('fs');
const path = require('path');
const dir = path.join('baby-buddy-dashboard', 'frontend', 'src', 'components', 'forms');
const files = fs.readdirSync(dir);
for (const file of files) {
  if (!file.endsWith('.jsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  const orig = content;
  content = content.replace(/new Date\(\`\$\{(start|end|time|date)\}:00\`\)\.toISOString\(\)/g, '\`\$\{$1\}:00-07:00\`');
  if (content !== orig) {
    fs.writeFileSync(p, content);
    console.log('Fixed', file);
  }
}
