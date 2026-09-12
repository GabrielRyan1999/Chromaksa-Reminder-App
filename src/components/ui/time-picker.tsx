"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./button";

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  showCurrentTimeButton?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled,
  error,
  className,
  showCurrentTimeButton = true,
}) => {
  const getDefaultTime = React.useCallback(() => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return {
      hour: String(h).padStart(2, "0"),
      minute: String(m).padStart(2, "0"),
      amPm: ap,
    };
  }, []);

  const [hour, setHour] = React.useState<string>("");
  const [minute, setMinute] = React.useState<string>("");
  const [amPm, setAmPm] = React.useState<string>("AM");

  const handleSetCurrentTime = React.useCallback(() => {
    const def = getDefaultTime();
    setHour(def.hour);
    setMinute(def.minute);
    setAmPm(def.amPm);
    if (onChange) {
      const newValue = `${def.hour}:${def.minute} ${def.amPm}`;
      onChange(newValue);
    }
  }, [getDefaultTime, onChange]);

  React.useEffect(() => {
    if (!value) {
      const def = getDefaultTime();
      setHour(def.hour);
      setMinute(def.minute);
      setAmPm(def.amPm);
      if (onChange) {
        const newValue = `${def.hour}:${def.minute} ${def.amPm}`;
        onChange(newValue);
      }
    } else if (
      typeof value === "string" &&
      value.match(/^\d{1,2}:\d{2} (AM|PM)$/)
    ) {
      const [hm, ap] = value.split(" ");
      const [h, m] = hm.split(":");
      setHour(h);
      setMinute(m);
      setAmPm(ap);
    }
  }, []);

  const handleChange = React.useCallback(
    (h: string, m: string, ap: string) => {
      setHour(h);
      setMinute(m);
      setAmPm(ap);
      if (h && m && ap && onChange) {
        const newValue = `${h}:${m} ${ap}`;
        if (newValue !== value) {
          onChange(newValue);
        }
      }
    },
    [onChange, value]
  );

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    setHour(val);
  };

  const handleHourBlur = () => {
    let h = parseInt(hour, 10);
    if (isNaN(h) || h === 0) h = 12;
    if (h > 12) h = 12;
    const finalH = String(h).padStart(2, "0");
    setHour(finalH);
    handleChange(finalH, minute, amPm);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    setMinute(val);
  };

  const handleMinuteBlur = () => {
    let m = parseInt(minute, 10);
    if (isNaN(m)) m = 0;
    if (m > 59) m = 59;
    const finalM = String(m).padStart(2, "0");
    setMinute(finalM);
    handleChange(hour, finalM, amPm);
  };

  return (
    <div
      className={
        className ??
        "flex flex-row items-center gap-2 " +
          (error ? "rounded border border-red-500 p-2" : "")
      }
    >
      <div className="flex flex-row items-center gap-1">
        <div className="w-[50px]">
          <input
            type="text"
            value={hour}
            onChange={handleHourChange}
            onBlur={handleHourBlur}
            disabled={disabled}
            placeholder="HH"
            className="flex h-8 w-full items-center justify-center rounded-md border border-[var(--color-brand-graphite)] border-opacity-20 bg-[var(--color-background)] px-2 text-center text-xs transition-all placeholder:opacity-60 focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-amber)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-black/5 dark:hover:bg-white/5"
          />
        </div>
        <span className="font-bold text-[var(--color-brand-graphite)]">:</span>
        <div className="w-[50px]">
          <input
            type="text"
            value={minute}
            onChange={handleMinuteChange}
            onBlur={handleMinuteBlur}
            disabled={disabled}
            placeholder="MM"
            className="flex h-8 w-full items-center justify-center rounded-md border border-[var(--color-brand-graphite)] border-opacity-20 bg-[var(--color-background)] px-2 text-center text-xs transition-all placeholder:opacity-60 focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-amber)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-black/5 dark:hover:bg-white/5"
          />
        </div>
        <div className="w-[65px]">
          <Select
            disabled={disabled}
            onValueChange={React.useCallback(
              (val: string) => handleChange(hour, minute, val),
              [hour, minute, handleChange]
            )}
            value={amPm}
          >
            <SelectTrigger size="sm" className="px-2 text-center justify-center gap-1">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
