import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['أحد', 'اثن', 'ثلث', 'أرب', 'خمس', 'جمع', 'سبت'];
const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const AIRBNB = '#FF385C';

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toKey(d) { return d.toISOString().split('T')[0]; }

export default function VenueCalendar({ bookedDates = [], onRangeSelect, readOnly = false, accent = AIRBNB, venueName = '' }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [hoverDate, setHoverDate] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);

  // ثيم موحّد للتقويم حتى لو صفحة العملاء مررت لون مختلف
  const themeAccent = AIRBNB;
  const bookedSet = new Set(bookedDates);

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // build calendar grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  function isInRange(d) {
    if (!rangeStart || !hoverDate || !d) return false;
    const lo = rangeStart <= hoverDate ? rangeStart : hoverDate;
    const hi = rangeStart <= hoverDate ? hoverDate : rangeStart;
    return d >= lo && d <= hi;
  }

  function handleDayClick(d) {
    if (!d || readOnly) return;
    const past = d < today;
    if (past) return;
    if (!rangeStart) {
      setRangeStart(d);
    } else {
      const start = rangeStart <= d ? rangeStart : d;
      const end   = rangeStart <= d ? d : rangeStart;
      onRangeSelect?.(toKey(start), toKey(end));
      setRangeStart(null);
      setHoverDate(null);
    }
  }

  return (
    <div className="select-none rounded-[1.4rem] bg-white/70">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="w-9 h-9 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all shadow-sm active:scale-[0.98]"
          aria-label="الشهر السابق"
        >
          <ChevronRight className="w-4 h-4 text-zinc-700" />
        </button>

        <div className="text-center">
          <span className="block font-black text-zinc-950 text-sm">{MONTHS[month]} {year}</span>
          {venueName && <span className="block text-[10px] font-bold text-zinc-400 mt-0.5">{venueName}</span>}
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="w-9 h-9 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all shadow-sm active:scale-[0.98]"
          aria-label="الشهر التالي"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-700" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1.5 rounded-2xl bg-zinc-50 border border-zinc-100 px-1 py-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-black text-zinc-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" />;

          const key = toKey(d);
          const isBooked = bookedSet.has(key);
          const isPast = d < today;
          const isToday = sameDay(d, today);
          const inRange = isInRange(d);
          const isStart = rangeStart && sameDay(d, rangeStart);

          let cellClass = 'w-full aspect-square flex items-center justify-center rounded-2xl text-[12px] font-bold transition-all border ';

          if (isBooked) {
            cellClass += 'bg-zinc-100 text-zinc-300 border-zinc-100 cursor-default line-through';
          } else if (isPast) {
            cellClass += 'bg-transparent text-zinc-300 border-transparent cursor-default';
          } else if (isStart || inRange) {
            cellClass += 'text-white border-transparent shadow-[0_10px_18px_rgba(255,56,92,0.22)] cursor-pointer scale-[0.98]';
          } else if (isToday) {
            cellClass += 'bg-white text-zinc-950 border-[#FF385C] cursor-pointer hover:bg-[#FF385C]/5';
          } else {
            cellClass += 'bg-white text-zinc-700 border-zinc-100 cursor-pointer hover:border-[#FF385C]/30 hover:bg-[#FF385C]/5 hover:text-zinc-950';
          }

          const bgStyle = (isStart || inRange)
            ? { background: themeAccent }
            : isToday
            ? { color: themeAccent }
            : {};

          return (
            <div
              key={i}
              className={cellClass}
              style={bgStyle}
              onClick={() => handleDayClick(d)}
              onMouseEnter={() => !readOnly && rangeStart && setHoverDate(d)}
              onMouseLeave={() => !readOnly && setHoverDate(null)}
              title={isBooked ? 'محجوز' : ''}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-zinc-100 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-bold">
          <div className="w-3 h-3 rounded-md bg-zinc-100 border border-zinc-200" />
          محجوز
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700">
          <div className="w-3 h-3 rounded-md bg-white border border-zinc-200" />
          متاح
        </div>
        {!readOnly && (
          <div className="text-[11px] text-zinc-400 font-bold">اختر تاريخ الدخول ثم الخروج</div>
        )}
      </div>
    </div>
  );
}
