const fs = require('fs');
const path = require('path');
['', 'sections', 'ui'].forEach(sub => {
  const dir = path.join('artifacts', 'web', 'src', 'components', sub);
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => {
      if (f.endsWith('.tsx')) {
        const p = path.join(dir, f);
        let c = fs.readFileSync(p, 'utf8');
        if (!c.startsWith('"use client"')) {
          fs.writeFileSync(p, '"use client";\n' + c);
        }
      }
    });
  }
});
console.log('Added use client to components');
