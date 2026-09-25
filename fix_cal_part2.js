const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const oldButtonRegex = /  const CustomDayButton = \(props: any\) => \{[\s\S]*?    \);\n  \};\n/g;
c = c.replace(oldButtonRegex, '');

const oldPicker = `<DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          className="mx-auto"
          showOutsideDays
          components={{ DayButton: CustomDayButton }}
        />`;

const newPicker = `<RemindersContext.Provider value={remindersByDate}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onSelectDate(date)}
            className="mx-auto"
            showOutsideDays
            components={{ DayButton: CustomDayButton }}
          />
        </RemindersContext.Provider>`;

c = c.replace(oldPicker, newPicker);
fs.writeFileSync('src/components/Sidebar.tsx', c);
