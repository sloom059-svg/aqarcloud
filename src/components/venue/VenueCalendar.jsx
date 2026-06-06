import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['أحد', 'اثن', 'ثلث', 'أرب', 'خمس', 'جمع', 'سبت'];
const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toKey(d) { return d.toISOString().split('T')[0]; }

export default function VenueCalendar({ bookedDates = [], onRangeSelect, readOnly = false, accent = '#c9a96e', venueName = '' }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [hoverDate, setHoverDate] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);

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
    <div className="select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
        <span className="font-black text-gray-900 text-sm">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;

          const key = toKey(d);
          const isBooked = bookedSet.has(key);
          const isPast = d < today;
          const isToday = sameDay(d, today);
          const inRange = isInRange(d);
          const isStart = rangeStart && sameDay(d, rangeStart);

          let cellClass = 'w-full aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ';

          if (isBooked) {
            cellClass += 'bg-red-100 text-red-400 cursor-default line-through';
          } else if (isPast) {
            cellClass += 'text-gray-300 cursor-default';
          } else if (isStart) {
            cellClass += 'text-white shadow-md cursor-pointer';
          } else if (inRange) {
            cellClass += 'text-white cursor-pointer';
          } else if (isToday) {
            cellClass += 'border-2 text-gray-900 cursor-pointer hover:opacity-80';
          } else {
            cellClass += 'text-gray-700 cursor-pointer hover:bg-gray-100';
          }

          const bgStyle = (isStart || inRange)
            ? { background: accent }
            : isToday
            ? { borderColor: accent, color: accent }
            : {};

          return (
            <div key={i}
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
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
          محجوز
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
          <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300" />
          متاح
        </div>
        {!readOnly && (
          <div className="text-xs text-gray-400">اضغط يومين لتحديد فترة</div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">سوف تظهر التواريخ المحجوزة في صفحة الشاليه</p>
    </div>
  );
}