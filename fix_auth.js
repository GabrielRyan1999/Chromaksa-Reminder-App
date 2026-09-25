const fs = require('fs');
let c = fs.readFileSync('src/app/auth/page.tsx', 'utf8');
c = c.replace('onClick={() => setShowPassword(!showPassword)}', 'aria-label={showPassword ? \"Hide password\" : \"Show password\"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}');

c = c.replace('if (hp) {\\n      setLoading(false);\\n      return; // Silent reject\\n    }', '');

fs.writeFileSync('src/app/auth/page.tsx', c);
