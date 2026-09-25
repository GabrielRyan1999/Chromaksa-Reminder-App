const fs = require('fs');
let c = fs.readFileSync('src/components/ClientDashboard.tsx', 'utf8');

c = c.replace('import GlobalSearch from "./GlobalSearch";', 'import GlobalSearch from "./GlobalSearch";\nimport ShortcutHelper from "./ShortcutHelper";');

const oldEnd = `      <GlobalSearch onSelectDate={(d) => { setSelectedDate(d); setSidebarOpen(false); }} />
      <UserMenu user={user} />
    </div>
  );
}`;

const newEnd = `      <GlobalSearch onSelectDate={(d) => { setSelectedDate(d); setSidebarOpen(false); }} />
      <ShortcutHelper />
      <UserMenu user={user} />
    </div>
  );
}`;

c = c.replace(oldEnd, newEnd);
fs.writeFileSync('src/components/ClientDashboard.tsx', c);
