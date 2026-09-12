"use client";

import { useState } from "react";
import { format } from "date-fns";
import Sidebar from "./Sidebar";
import DayView from "./DayView";
import UserMenu from "./UserMenu";

export default function ClientDashboard({ user }: { user: any }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless sidebarOpen is true */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSidebarOpen(false); }} />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 w-full">
        <DayView selectedDate={selectedDate} user={user} onMenuClick={() => setSidebarOpen(true)} />
      </div>
      <UserMenu user={user} />
    </div>
  );
}
