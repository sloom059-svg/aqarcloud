import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2, Plus, X, CheckCircle,
  Bell, Wallet, LogOut, User, Calendar,
  ChevronDown, ChevronRight, Phone,
  Edit3, Inbox, Clock, CheckCircle2, XCircle, Calendar as CalendarIcon,
  FileText, Eye, Download, MapPin, QrCode
} from 'lucide-react';
import VenueCalendar from '@/components/venue/VenueCalendar';

// ── أيقونات SVG ──
const EditIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const DeleteIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);
const PinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconWa = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
const IconLock = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-4 h-4"}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;

const IconInstagram = ({ className }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 00-.88-1.35 3.6 3.6 0 00-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07zM12 6.87a5.13 5.13 0 100 10.26 5.13 5.13 0 000-10.26zm0 8.46a3.33 3.33 0 110-6.66 3.33 3.33 0 010 6.66zm6.54-8.66a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/></svg>;
const IconTiktok = ({ className }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/></svg>;
const IconX = ({ className }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zM17.61 20.64h2.04L6.49 3.24H4.3z"/></svg>;
const IconSnapchat = ({ className }) => <svg viewBox="0 0 448 512" fill="currentColor" className={className}><path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/></svg>;

const ARABIC_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const formatDateAr = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]}`;
};
const formatWhatsApp = (phone) => {
  if (!phone) return '';
  let p = phone.replace(/\D/g, '');
  if (p.startsWith('05')) return '966' + p.substring(1);
  return p;
};

// حساب عدد الليالي
const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const a = new Date(checkIn), b = new Date(checkOut);
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return null;
  if (diff === 1) return 'ليلة واحدة';
  if (diff === 2) return 'ليلتان';
  if (diff <= 10) return `${diff} ليالٍ`;
  return `${diff} ليلة`;
};

// حساب سعر الحجز من أسعار الشاليه (ويكند: خميس/جمعة)
const calcBookingPrice = (booking, venue) => {
  if (booking?.price) return Number(booking.price);
  if (booking?.total_price) return Number(booking.total_price);
  if (!venue || !booking?.check_in || !booking?.check_out) return null;
  const weekday = Number(venue.price_weekday) || 0;
  const weekend = Number(venue.price_weekend) || weekday;
  if (!weekday && !weekend) return null;
  let total = 0;
  let cur = new Date(booking.check_in);
  const end = new Date(booking.check_out);
  while (cur < end) {
    const day = cur.getDay(); // 0=أحد ... 4=خميس, 5=جمعة, 6=سبت
    const isWeekend = day === 4 || day === 5; // خميس وجمعة
    total += isWeekend ? weekend : weekday;
    cur.setDate(cur.getDate() + 1);
  }
  return total || null;
};

// يولّد رقم مرجعي ثابت من الـ UUID (4 أرقام)
const getBookingRef = (id) => {
  if (!id) return '#0000';
  const hex = id.replace(/-/g, '').slice(-6);
  const num = (parseInt(hex, 16) % 9000) + 1000;
  return `#${num}`;
};

const STATUS_MAP = {
  'جديد':      { border: 'bg-blue-500',    select: 'bg-blue-50 text-blue-700 border-blue-200',         statBg: 'bg-blue-50',    statText: 'text-blue-600',    statIcon: Inbox },
  'بالانتظار': { border: 'bg-amber-500',   select: 'bg-amber-50 text-amber-700 border-amber-200',       statBg: 'bg-amber-50',   statText: 'text-amber-500',   statIcon: Clock },
  'مؤكد':      { border: 'bg-emerald-500', select: 'bg-emerald-50 text-emerald-700 border-emerald-200', statBg: 'bg-emerald-50', statText: 'text-emerald-600', statIcon: CheckCircle2 },
  'ملغي':      { border: 'bg-rose-500',    select: 'bg-rose-50 text-rose-700 border-rose-200',          statBg: 'bg-rose-50',    statText: 'text-rose-500',    statIcon: XCircle },
};

const EMPTY_MANUAL = { client_name: '', client_phone: '', check_in: '', check_out: '', notes: '' };

// ── Dropdown الملف الشخصي / الخروج ──
function ProfileMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all text-white/90 hover:text-white flex items-center gap-1"
        title="القائمة"
      >
        <LogOut className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            <User className="w-4 h-4 text-[#15317E]" /> الملف الشخصي
          </Link>
          <div className="h-px bg-slate-100" />
          <button onClick={() => { setOpen(false); onLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium">
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

export default function VenueBookings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, logout } = useAuth();

  const [toastMessage, setToastMessage] = useState('');
  const [showRevenue, setShowRevenue]   = useState(false);
  const [showNotifs, setShowNotifs]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showManual, setShowManual]     = useState(false);
  const [manualForm, setManualForm]     = useState(EMPTY_MANUAL);
  const [editBooking, setEditBooking]   = useState(null);
  const [editForm, setEditForm]         = useState({ client_name: '', client_phone: '', check_in: '', check_out: '' });
  const [editConflict, setEditConflict] = useState(false);

  // سند الاستلام
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [receiptForm, setReceiptForm]       = useState({ type: 'deposit', amount: '' });
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const receiptRef = useRef(null);

  const revenueRef = useRef(null);
  const notifsRef  = useRef(null);

  // إغلاق الـ dropdowns عند الضغط خارجها
  useEffect(() => {
    const handler = (e) => {
      if (revenueRef.current && !revenueRef.current.contains(e.target)) setShowRevenue(false);
      if (notifsRef.current  && !notifsRef.current.contains(e.target))  setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  const handleLogout = async () => { await logout(false); navigate('/login'); };

  // ── Queries ──
  const { data: venue } = useQuery({
    queryKey: ['venue-single', id],
    queryFn: () => base44.entities.Venue.filter({ id }).then(r => r[0]),
  });

  const { data: allBookings = [], isLoading } = useQuery({
    queryKey: ['venue-bookings', id],
    queryFn: () => base44.entities.Booking.filter({ venue_id: id }, '-created_date'),
  });

  // كل حجوزات المالك للإشعارات والإيرادات
  const { data: ownerBookings = [] } = useQuery({
    queryKey: ['bookings-all', user?.id],
    queryFn: () => base44.entities.Booking.filter({ owner_id: user?.id }),
    enabled: !!user?.id,
  });

  const { data: venues = [] } = useQuery({
    queryKey: ['venues', user?.id],
    queryFn: () => base44.entities.Venue.filter({ owner_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });

  // فلتر الحجوزات (آخر 30 يوم)
  const bookings = allBookings.filter(b => {
    if (!b.check_out) return true;
    const checkout = new Date(b.check_out);
    if (isNaN(checkout)) return true;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - 30);
    return checkout >= cutoff;
  });

  // إيرادات الشهر
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();
  const isThisMonth = (b) => {
    const d = b.check_in ? new Date(b.check_in) : (b.created_date ? new Date(b.created_date) : null);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  };
  const venuePrice = (venueId) => { const v = venues.find(x => x.id === venueId); return v?.price_weekend || 0; };
  const monthlyRevenue = ownerBookings
    .filter(b => b.status === 'مؤكد' && isThisMonth(b))
    .reduce((sum, b) => sum + (b.total_price ? Number(b.total_price) : venuePrice(b.venue_id)), 0);

  // الإشعارات
  const newBookings = ownerBookings.filter(b => b.status === 'جديد');
  const hasNotifications = newBookings.length > 0;

  // ── Mutations ──
  const updateMutation = useMutation({
    mutationFn: ({ bookingId, data }) => base44.entities.Booking.update(bookingId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-bookings', id] }); showToast('تم تحديث حالة الحجز بنجاح!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (bookingId) => base44.entities.Booking.delete(bookingId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-bookings', id] }); setConfirmDelete(null); showToast('تم حذف الحجز بنجاح!'); },
  });

  const addBookingMutation = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-bookings', id] }); setShowManual(false); setManualForm(EMPTY_MANUAL); showToast('تم إضافة الحجز اليدوي بنجاح!'); },
  });

  const bookedDates = bookings
    .filter(b => b.status === 'مؤكد' || b.status === 'بالانتظار')
    .flatMap(b => {
      const dates = []; let cur = new Date(b.check_in); const end = new Date(b.check_out);
      while (cur <= end) { dates.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + 1); }
      return dates;
    });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.client_name || !manualForm.client_phone || !manualForm.check_in || !manualForm.check_out) return;
    addBookingMutation.mutate({ ...manualForm, venue_id: id, venue_name: venue?.name || '', status: 'مؤكد', owner_id: venue?.owner_id, is_manual: true });
  };

  const openEdit = (booking) => {
    setEditBooking(booking.id);
    setEditForm({ client_name: booking.client_name, client_phone: booking.client_phone, check_in: booking.check_in, check_out: booking.check_out });
    setEditConflict(false);
  };

  const checkConflict = (check_in, check_out, currentId) => {
    if (!check_in || !check_out) return false;
    const otherBooked = bookings.filter(b => b.id !== currentId && (b.status === 'مؤكد' || b.status === 'بالانتظار'))
      .flatMap(b => { const dates = []; let cur = new Date(b.check_in); const end = new Date(b.check_out); while (cur <= end) { dates.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + 1); } return dates; });
    const otherSet = new Set(otherBooked);
    let cur = new Date(check_in); const end = new Date(check_out);
    while (cur <= end) { if (otherSet.has(cur.toISOString().split('T')[0])) return true; cur.setDate(cur.getDate() + 1); }
    return false;
  };

  const handleEditFormChange = (field, value) => {
    const updated = { ...editForm, [field]: value };
    setEditForm(updated);
    if (updated.check_in && updated.check_out) setEditConflict(checkConflict(updated.check_in, updated.check_out, editBooking));
  };

  const handleEditSave = () => {
    if (editConflict) return;
    updateMutation.mutate({ bookingId: editBooking, data: editForm });
    setEditBooking(null);
    showToast('تم تعديل تفاصيل الحجز بنجاح!');
  };

  // ── سند الاستلام ──
  const openReceipt = (booking) => {
    setReceiptBooking(booking);
    const total = calcBookingPrice(booking, venue);
    setReceiptForm({ type: 'full', amount: total ? String(total) : '' });
  };

  const handleReceiptTypeChange = (type) => {
    const total = calcBookingPrice(receiptBooking, venue);
    let amount = receiptForm.amount;
    if (type === 'full') amount = total ? String(total) : '';
    else amount = ''; // عربون/دفعة يكتبه بنفسه
    setReceiptForm({ type, amount });
  };

  const receiptTypeLabel = (t) => t === 'deposit' ? 'عربون حجز' : t === 'partial' ? 'دفعة من حساب الحجز' : 'تسوية كامل قيمة الحجز';

  const sendReceiptWhatsApp = () => {
    if (!receiptBooking) return;
    const phone = formatWhatsApp(receiptBooking.client_phone);
    const typeLabel = receiptTypeLabel(receiptForm.type);
    const nights = getNights(receiptBooking.check_in, receiptBooking.check_out) || '';
    const message = `أهلاً بك\n\n` +
      `تم إصدار سند استلام من ${venue?.name || 'المنشأة'}:\n\n` +
      `الضيف: ${receiptBooking.client_name}\n` +
      `المبلغ: ${receiptForm.amount || 0} ريال سعودي\n` +
      `الدفعة عبارة عن: ${typeLabel}\n` +
      `تاريخ الحجز: ${formatDateAr(receiptBooking.check_in)} إلى ${formatDateAr(receiptBooking.check_out)}${nights ? ` (${nights})` : ''}\n\n` +
      `نتمنى لك إقامة سعيدة!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloadingReceipt(true);
    try {
      // انتظار جاهزية الخطوط (بدون ما يوقف لو فشل)
      try { if (document.fonts?.ready) await document.fonts.ready; } catch (_) {}
      await new Promise(r => setTimeout(r, 200));

      const html2canvas = (await import('html2canvas')).default;
      const node = receiptRef.current;
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: node.offsetWidth,
        height: node.offsetHeight,
        windowWidth: node.offsetWidth,
        windowHeight: node.offsetHeight,
        onclone: (doc) => {
          const wrap = doc.querySelector('.receipt-scale-wrap');
          if (wrap) { wrap.style.transform = 'none'; wrap.style.margin = '0'; }
        },
      });

      const fileName = `سند-${receiptBooking?.client_name || 'استلام'}.png`;
      const dataUrl = canvas.toDataURL('image/png');

      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      // محاولة المشاركة على الجوال (لو متاحة)
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'سند استلام' });
            setDownloadingReceipt(false);
            return;
          }
        } catch (_) { /* نكمل للطريقة البديلة */ }
      }

      // آيفون: افتح الصورة بتبويب للحفظ اليدوي
      if (isIOS) {
        const win = window.open();
        if (win) {
          win.document.write(`<img src="${dataUrl}" style="width:100%" alt="سند" />`);
        } else {
          window.location.href = dataUrl;
        }
        showToast('اضغط مطولاً على الصورة لحفظها');
        setDownloadingReceipt(false);
        return;
      }

      // أندرويد/كمبيوتر: تنزيل مباشر
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('تم تنزيل السند بنجاح!');
    } catch (err) {
      showToast('تعذّر التنزيل: ' + (err?.message || 'خطأ غير معروف'));
    }
    setDownloadingReceipt(false);
  };

  const statusOrder = ['جديد', 'بالانتظار', 'مؤكد', 'ملغي'];

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      `}} />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] bg-[#15317E] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#0d1e4c]">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Modal تعديل */}
      {editBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditBooking(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[#15317E] flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> تعديل تفاصيل الحجز
              </h3>
              <button onClick={() => setEditBooking(null)} className="p-1.5 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">اسم العميل</Label>
                <Input value={editForm.client_name} onChange={e => handleEditFormChange('client_name', e.target.value)} className="h-11 rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">رقم الجوال</Label>
                <Input value={editForm.client_phone} onChange={e => handleEditFormChange('client_phone', e.target.value)} className="h-11 rounded-xl text-sm" dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الدخول</Label>
                  <Input type="date" value={editForm.check_in} onChange={e => handleEditFormChange('check_in', e.target.value)} className="h-11 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الخروج</Label>
                  <Input type="date" value={editForm.check_out} onChange={e => handleEditFormChange('check_out', e.target.value)} className="h-11 rounded-xl text-sm" />
                </div>
              </div>
              {editConflict && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-red-700 font-bold">الفترة المختارة تتعارض مع حجز موجود.</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <Button onClick={handleEditSave} disabled={updateMutation.isPending || editConflict} className="flex-1 h-11 text-sm font-bold bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-xl">
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ التعديلات'}
              </Button>
              <button onClick={() => setEditBooking(null)} className="px-4 h-11 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal حجز يدوي */}
      {showManual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowManual(false)}>
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[#15317E] flex items-center gap-2">
                <div className="bg-[#15317E]/10 p-1.5 rounded-lg"><Plus className="w-4 h-4 text-[#15317E]" /></div>
                إضافة حجز يدوي
              </h3>
              <button onClick={() => { setShowManual(false); setManualForm(EMPTY_MANUAL); }} className="p-1.5 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleManualSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">اسم العميل *</Label>
                <Input value={manualForm.client_name} onChange={e => setManualForm(p => ({ ...p, client_name: e.target.value }))} placeholder="محمد عبدالله" required className="h-11 rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">رقم الجوال *</Label>
                <Input value={manualForm.client_phone} dir="ltr" onChange={e => setManualForm(p => ({ ...p, client_phone: e.target.value }))} placeholder="05xxxxxxxx" required className="h-11 rounded-xl text-sm" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الدخول *</Label>
                  <Input type="date" value={manualForm.check_in} onChange={e => setManualForm(p => ({ ...p, check_in: e.target.value }))} required className="h-11 rounded-xl text-sm" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500">تاريخ الخروج *</Label>
                  <Input type="date" value={manualForm.check_out} onChange={e => setManualForm(p => ({ ...p, check_out: e.target.value }))} required className="h-11 rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">ملاحظات (اختياري)</Label>
                <Input value={manualForm.notes} onChange={e => setManualForm(p => ({ ...p, notes: e.target.value }))} placeholder="أي تفاصيل إضافية..." className="h-11 rounded-xl text-sm" />
              </div>
              <Button type="submit" disabled={addBookingMutation.isPending} className="w-full h-11 rounded-xl font-bold bg-[#15317E] hover:bg-[#0d1e4c] text-white text-sm">
                {addBookingMutation.isPending ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</> : 'تأكيد الحجز'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* الخلفية الزرقاء العلوية */}
      <div className="absolute top-0 left-0 right-0 h-[220px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg" />

      <div className="relative z-10 max-w-md mx-auto">

        {/* ═══════════════════════════════════════
            الهيدر — نفس لوحة التحكم بالضبط
        ═══════════════════════════════════════ */}
        <header className="px-5 pt-8 pb-6 flex items-center justify-between text-white">

          {/* يسار: صورة المالك + رجوع + اسم الصفحة */}
          <div className="flex items-center gap-3">
            {/* زر رجوع */}
            <button
              onClick={() => navigate('/venue')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all"
              title="رجوع"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* الشعار / الحرف الأول */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                {user?.office_logo_url ? (
                  <img src={user.office_logo_url} alt="شعار" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {(venue?.name || 'ش')[0]}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#15317E] rounded-full" />
            </div>

            {/* العنوان */}
            <div>
              <h1 className="text-base font-bold leading-tight">إدارة الحجوزات</h1>
              {venue && <p className="text-[11px] text-white/70 mt-0.5">{venue.name}</p>}
            </div>
          </div>

          {/* يمين: الإشعارات + المحفظة + الخروج */}
          <div className="flex items-center gap-2">

            {/* الإشعارات */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-2.5 rounded-xl backdrop-blur-md transition-all ${showNotifs ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white'}`}
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {hasNotifications && (
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                )}
              </button>
              {showNotifs && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-[#15317E] text-white flex items-center justify-between">
                    <span className="text-sm font-bold">الإشعارات</span>
                    {hasNotifications && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{newBookings.length}</span>}
                  </div>
                  {newBookings.length === 0 ? (
                    <div className="px-4 py-6 text-center"><p className="text-sm text-slate-400">لا توجد إشعارات جديدة</p></div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {newBookings.map(b => {
                        const v = venues.find(x => x.id === b.venue_id);
                        return (
                          <Link key={b.id} to={`/venue/bookings/${b.venue_id}`} onClick={() => setShowNotifs(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                            <div className="w-9 h-9 rounded-xl bg-[#15317E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Calendar className="w-4 h-4 text-[#15317E]" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-sm font-bold text-slate-700">حجز جديد</p>
                              <p className="text-xs text-slate-500 truncate">{b.client_name || 'عميل'} — {v?.name || 'شاليه'}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* المحفظة / الإيرادات */}
            <div className="relative" ref={revenueRef}>
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${showRevenue ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90'}`}
                title="إيرادات الشهر"
              >
                <Wallet className="w-4 h-4" />
              </button>
              {showRevenue && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-center animate-in fade-in slide-in-from-top-2">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">إيرادات الشهر (الحجوزات المؤكدة)</p>
                  <p className="text-xl font-bold text-[#15317E]" dir="ltr">
                    {monthlyRevenue.toLocaleString('en-US')} <span className="text-[10px] font-normal text-slate-400">ر.س</span>
                  </p>
                </div>
              )}
            </div>

            {/* زر الخروج */}
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </header>

        {/* ═══════════════════════════════════════
            المحتوى
        ═══════════════════════════════════════ */}
        <div className="px-4 space-y-6">

          {/* كروت الإحصائيات */}
          <div className="flex gap-2">
            {statusOrder.map(s => {
              const count = bookings.filter(b => b.status === s).length;
              const cfg = STATUS_MAP[s];
              const Icon = cfg.statIcon;
              return (
                <div key={s} className="flex-1 bg-white rounded-2xl py-2 px-1 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-0.5">
                  <div className={`p-1 ${cfg.statBg} rounded-lg`}><Icon className={`w-3.5 h-3.5 ${cfg.statText}`} /></div>
                  <p className={`text-base font-black leading-none mt-0.5 ${cfg.statText}`}>{count}</p>
                  <p className="text-[10px] font-bold text-slate-500">{s}</p>
                </div>
              );
            })}
          </div>

          {/* التقويم */}
          <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-[#15317E] flex items-center gap-2 mb-4">
              <CalendarIcon className="w-4 h-4 text-[#15317E]/70" />
              التقويم والإتاحة
            </h3>
            <VenueCalendar bookedDates={bookedDates} onRangeSelect={null} readOnly={true} venueName={venue?.name || ''} />
            <p className="text-xs text-gray-400 mt-2">سوف تظهر التواريخ المحجوزة في صفحة الشاليه</p>
          </div>

          {/* عنوان القائمة + زر حجز يدوي */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#15317E]">الحجوزات</h3>
            <button
              onClick={() => setShowManual(true)}
              className="flex items-center gap-1.5 bg-white text-[#15317E] px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> حجز يدوي
            </button>
          </div>

          {/* قائمة الحجوزات */}
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
              <p className="font-bold text-base">لا توجد حجوزات حالياً</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const cfg = STATUS_MAP[booking.status] || STATUS_MAP['جديد'];
                const isDeleting    = confirmDelete === booking.id;
                const isManualBlock = booking.client_phone === '000';
                const bookingRef    = getBookingRef(booking.id);

                return (
                  <div key={booking.id} className="bg-white rounded-[1.2rem] p-3 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-1 h-full ${cfg.border}`} />

                    <div className="flex justify-between items-start mb-3 pl-1 pr-2">
                      {/* معلومات العميل */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {!isManualBlock ? (
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                              <PinIcon className="w-3.5 h-3.5 text-slate-400" />{booking.client_name}
                            </h4>
                          ) : (
                            <h4 className="text-sm font-bold text-slate-600 flex items-center gap-1">
                              <IconLock className="w-3.5 h-3.5" /> إغلاق يدوي
                            </h4>
                          )}
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md" dir="ltr">{bookingRef}</span>
                        </div>
                        {!isManualBlock && booking.client_phone && booking.client_phone !== '000' && (
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span dir="ltr">{booking.client_phone}</span>
                            </p>
                            <a href={`https://wa.me/${formatWhatsApp(booking.client_phone)}?text=${encodeURIComponent(`مرحباً ${booking.client_name}، نتواصل معك بخصوص حجزك...`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium transition-colors">
                              <IconWa className="w-3 h-3" /> مراسلة
                            </a>
                          </div>
                        )}
                        {booking.notes && !isManualBlock && (
                          <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1 mt-1 border border-slate-100 inline-block">{booking.notes}</div>
                        )}
                      </div>

                      {/* الأزرار اليمين */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="relative">
                          <select
                            value={booking.status}
                            onChange={(e) => updateMutation.mutate({ bookingId: booking.id, data: { status: e.target.value } })}
                            className={`appearance-none pl-6 pr-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer transition-colors ${cfg.select}`}
                          >
                            <option value="جديد">جديد</option>
                            <option value="بالانتظار">بالانتظار</option>
                            <option value="مؤكد">مؤكد</option>
                            <option value="ملغي">ملغي</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                        <div className="flex items-center gap-1">
                          {!isManualBlock && (
                            <button onClick={() => openReceipt(booking)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="إصدار سند استلام">
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          {!isManualBlock && (
                            <button onClick={() => openEdit(booking)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => setConfirmDelete(booking.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="حذف">
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* شريط التواريخ + الليالي + السعر */}
                    <div className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 mx-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateAr(booking.check_in)} ← {formatDateAr(booking.check_out)}</span>
                      </div>
                      {getNights(booking.check_in, booking.check_out) && (
                        <>
                          <div className="w-px h-3 bg-slate-200" />
                          <div className="text-[11px] text-slate-600 font-medium">{getNights(booking.check_in, booking.check_out)}</div>
                        </>
                      )}
                      <div className="w-px h-3 bg-slate-200" />
                      <div className="text-[11px] text-[#15317E] font-bold">
                        {calcBookingPrice(booking, venue) ? `${calcBookingPrice(booking, venue).toLocaleString('en-US')} ر.س` : '—'}
                      </div>
                    </div>

                    {/* تأكيد الحذف فقط */}
                    {isDeleting && (
                      <div className="flex items-center gap-2 w-full bg-red-50 p-2.5 rounded-xl border border-red-100 mt-3">
                        <span className="text-xs text-red-800 font-bold ml-auto">تأكيد الحذف؟</span>
                        <button onClick={() => deleteMutation.mutate(booking.id)} disabled={deleteMutation.isPending}
                          className="flex items-center gap-1 text-xs font-bold text-white bg-red-600 rounded-lg px-3 py-1.5 hover:bg-red-700 transition">
                          {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'نعم، احذف'}
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">تراجع</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══════════ مودال إصدار السند ══════════ */}
      {receiptBooking && !showReceiptPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setReceiptBooking(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[#15317E] flex items-center gap-2 text-sm">
                <div className="bg-amber-100 p-1 rounded-lg"><FileText className="w-4 h-4 text-amber-600" /></div>
                إصدار سند استلام
              </h3>
              <button onClick={() => setReceiptBooking(null)} className="p-1 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-[#15317E]/5 border border-[#15317E]/10 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold mb-0.5">سند لصالح</p>
                  <p className="text-xs font-black text-[#15317E]">{receiptBooking.client_name}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-bold mb-0.5">إجمالي الحجز</p>
                  <p className="text-xs font-bold text-slate-700">{calcBookingPrice(receiptBooking, venue) ? `${calcBookingPrice(receiptBooking, venue).toLocaleString('en-US')}` : '—'} ر.س</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-2">نوع الدفعة</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ id: 'deposit', label: 'عربون' }, { id: 'partial', label: 'دفعة' }, { id: 'full', label: 'كامل المبلغ' }].map(t => (
                    <button key={t.id} type="button" onClick={() => handleReceiptTypeChange(t.id)}
                      className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${receiptForm.type === t.id ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">مبلغ السند (ريال)</label>
                <input type="number" value={receiptForm.amount} onChange={e => setReceiptForm({ ...receiptForm, amount: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#15317E] focus:ring-1 focus:ring-[#15317E] outline-none transition-all text-sm font-black text-left" dir="ltr" placeholder="0.00" />
              </div>

              <div className="pt-2 flex gap-2">
                <button onClick={() => { if (!receiptForm.amount) { showToast('أدخل مبلغ السند'); return; } setShowReceiptPreview(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#15317E] hover:bg-[#0d1e4c] text-white rounded-xl font-bold text-xs transition-all shadow-sm">
                  <Eye className="w-3.5 h-3.5" /> معاينة السند
                </button>
                <button onClick={sendReceiptWhatsApp}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-bold text-xs transition-all shadow-sm">
                  <IconWa className="w-3.5 h-3.5" /> إرسال للعميل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ معاينة السند PDF ══════════ */}
      {showReceiptPreview && receiptBooking && (
        <div className="fixed inset-0 z-[200] bg-slate-800/90 backdrop-blur-sm overflow-auto flex flex-col items-center py-6 px-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          <div className="sticky top-2 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-slate-200 mb-4">
            <button onClick={downloadReceipt} disabled={downloadingReceipt} className="flex items-center gap-2 bg-[#15317E] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#0d1e4c] transition-all shadow-sm disabled:opacity-60">
              {downloadingReceipt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} تنزيل السند
            </button>
            <button onClick={() => setShowReceiptPreview(false)} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
              <X className="w-4 h-4" /> إغلاق المعاينة
            </button>
          </div>

          {/* غلاف للتصغير على الجوال */}
          <div className="receipt-scale-wrap">
            <div ref={receiptRef} dir="rtl" className="receipt-page w-[210mm] min-h-[297mm] shrink-0 bg-white text-slate-900 relative shadow-2xl flex flex-col" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              <div className="absolute inset-3 border-2 border-[#15317E] rounded-2xl pointer-events-none" />
              <div className="absolute inset-4 border border-[#15317E]/30 rounded-xl pointer-events-none" />

            <div className="px-12 pt-14 pb-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#15317E] rounded-2xl flex items-center justify-center text-white shadow-md overflow-hidden">
                    {user?.office_logo_url ? <img src={user.office_logo_url} alt="" className="w-full h-full object-cover" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-[#15317E] mb-1">{venue?.name || 'المنشأة'}</h1>
                    {venue?.city && <p className="text-xs font-bold tracking-widest text-slate-400">{venue.city}</p>}
                  </div>
                </div>
                <div className="text-left border-r-4 border-[#15317E] pr-5">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">سند استلام</h2>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Receipt Voucher</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-bold text-slate-600 flex justify-end gap-1.5">
                      <span>التاريخ:</span>
                      <span dir="ltr">{new Date().toLocaleDateString('en-GB')}</span>
                    </p>
                    <p className="text-xs font-bold text-slate-600">رقم المرجع: <span dir="ltr">{getBookingRef(receiptBooking.id)}</span></p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-l from-transparent via-[#15317E]/20 to-transparent mb-10" />

              <div className="px-2 space-y-8">
                <div className="flex items-baseline gap-4 border-b-2 border-slate-100 pb-4">
                  <span className="text-lg font-bold text-slate-500 min-w-[120px]">استلمنا من السيد/ة:</span>
                  <span className="text-xl font-black text-[#15317E]">{receiptBooking.client_name}</span>
                </div>
                <div className="flex items-baseline gap-4 border-b-2 border-slate-100 pb-4">
                  <span className="text-lg font-bold text-slate-500 min-w-[120px]">مبلغ وقدره:</span>
                  <span className="text-2xl font-black text-slate-800">{receiptForm.amount || '0'} <span className="text-sm font-bold text-slate-500">ريال سعودي</span></span>
                </div>
                <div className="flex items-baseline gap-4 border-b-2 border-slate-100 pb-4">
                  <span className="text-lg font-bold text-slate-500 min-w-[120px]">وذلك عبارة عن:</span>
                  <span className="text-lg font-bold text-slate-800 leading-relaxed">
                    {receiptTypeLabel(receiptForm.type)} - للفترة من والى: <span dir="ltr" className="inline-block px-1">{formatDateAr(receiptBooking.check_in)} → {formatDateAr(receiptBooking.check_out)}</span>
                    {getNights(receiptBooking.check_in, receiptBooking.check_out) ? ` (${getNights(receiptBooking.check_in, receiptBooking.check_out)})` : ''}
                  </span>
                </div>
              </div>

              <div className="mt-12 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-[#15317E] mb-3 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706]" /> الشروط والأحكام
                </h4>
                <ul className="text-sm font-medium text-slate-600 space-y-2 list-disc list-inside">
                  <li>هذا السند يثبت استلام المبلغ الموضح أعلاه فقط ولا يمثل تأكيداً نهائياً للحجز ما لم يسدد كامل المبلغ.</li>
                  <li>العربون المدفوع <span className="text-rose-600 font-bold">غير مسترد</span> في حال إلغاء الحجز من قبل الضيف.</li>
                  <li>يجب دفع باقي قيمة الحجز كاملاً قبل أو عند تسجيل الدخول.</li>
                  <li>يتم تحصيل مبلغ تأمين إضافي عند الدخول ويسترد عند الخروج بعد التأكد من سلامة الممتلكات.</li>
                </ul>
              </div>
            </div>

            <div className="mt-auto px-12 pb-6 pt-6 border-t border-[#15317E]/10 bg-slate-50/50 rounded-b-xl mx-4 mb-4 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className="flex flex-col text-right gap-1.5">
                  {(user?.phone || receiptBooking.client_phone) && (
                    <span className="text-[#15317E] font-black text-lg flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D97706]" /> <span dir="ltr">{user?.phone || ''}</span>
                    </span>
                  )}
                  {venue?.city && (
                    <span className="text-slate-500 font-bold text-xs flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {venue.city}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-left pl-2">
                    <span className="block text-xs font-black text-[#15317E]">امسح الرمز</span>
                    <span className="block text-[10px] font-bold text-slate-500">لزيارة صفحة المنشأة</span>
                  </div>
                  <div className="p-1 bg-[#15317E] rounded-lg"><QrCode className="w-10 h-10 text-white" strokeWidth={1.5} /></div>
                </div>
              </div>

              {/* أيقونات التواصل الاجتماعي */}
              {venue?.social && (venue.social.instagram || venue.social.tiktok || venue.social.x || venue.social.snapchat) && (
                <div className="flex justify-center items-center gap-6 pt-4 border-t border-[#15317E]/5">
                  {venue.social.instagram && (
                    <div className="flex items-center gap-1.5 text-[#15317E]">
                      <span dir="ltr" className="text-[11px] font-bold tracking-wide">{venue.social.instagram}</span>
                      <IconInstagram className="w-4 h-4" />
                    </div>
                  )}
                  {venue.social.x && (
                    <div className="flex items-center gap-1.5 text-[#15317E]">
                      <span dir="ltr" className="text-[11px] font-bold tracking-wide">{venue.social.x}</span>
                      <IconX className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {venue.social.snapchat && (
                    <div className="flex items-center gap-1.5 text-[#15317E]">
                      <span dir="ltr" className="text-[11px] font-bold tracking-wide">{venue.social.snapchat}</span>
                      <IconSnapchat className="w-4 h-4" />
                    </div>
                  )}
                  {venue.social.tiktok && (
                    <div className="flex items-center gap-1.5 text-[#15317E]">
                      <span dir="ltr" className="text-[11px] font-bold tracking-wide">{venue.social.tiktok}</span>
                      <IconTiktok className="w-4 h-4" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .receipt-scale-wrap {
          transform-origin: top center;
        }
        @media (max-width: 820px) {
          .receipt-scale-wrap {
            transform: scale(0.42);
            margin-bottom: -650px;
          }
        }
        @media (max-width: 480px) {
          .receipt-scale-wrap {
            transform: scale(0.34);
            margin-bottom: -780px;
          }
        }
      `}} />
    </div>
  );
}
