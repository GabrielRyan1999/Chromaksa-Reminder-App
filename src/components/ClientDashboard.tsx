"use client";

import { useState } from "react";
import { format } from "date-fns";
import Sidebar from "./Sidebar";
import DayView from "./DayView";
import UserMenu from "./UserMenu";

export default function ClientDashboard({ user }: { user: any }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      <Sidebar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <DayView selectedDate={selectedDate} user={user} />
      <UserMenu user={user} />
    </div>
  );
}
