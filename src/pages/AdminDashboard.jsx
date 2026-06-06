import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44, supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, Users, Home, CalendarDays, TrendingUp, Search, ChevronDown, MapPin, Phone, Mail, Building2, Hotel } from 'lucide-react';

const ADMIN_EMAIL = 'sloom059@gmail.com';

// ── بطاقة إحصاء ──
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

// ── تبويب ──
const Tab = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
      active ? 'bg-[#15317E] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
        {count}
      </span>
    )}
  </button>
);

export default function AdminDashboard() {
  const { user, isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [search, setSearch] = useState('');

  // ── حماية: فقط الأدمن ──
  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>;
  }
  if (user?.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return <AdminContent activeTab={activeTab} setActiveTab={setActiveTab} search={search} setSearch={setSearch} />;
}

function AdminContent({ activeTab, setActiveTab, search, setSearch }) {
  // ── جلب البيانات ──
  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ['admin-members'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').order('id');
      return data || [];
    },
  });

  const { data: properties = [], isLoading: loadingProperties } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data } = await supabase.from('property').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: venues = [], isLoading: loadingVenues } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: async () => {
      const { data } = await supabase.from('venue').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data } = await supabase.from('booking').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const isLoading = loadingMembers || loadingProperties || loadingVenues || loadingBookings;

  // ── فلترة البحث ──
  const filteredMembers = members.filter(m =>
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.full_name?.includes(search) ||
    m.office_name?.includes(search)
  );

  const filteredProperties = properties.filter(p =>
    p.title?.includes(search) || p.city?.includes(search)
  );

  const filteredVenues = venues.filter(v =>
    v.name?.includes(search) || v.city?.includes(search)
  );

  const filteredBookings = bookings.filter(b =>
    b.guest_name?.includes(search) || b.status?.includes(search)
  );

  // ── نوع النشاط ──
  const businessTypes = members.reduce((acc, m) => {
    const t = m.business_type || 'غير محدد';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC]">

      {/* الهيدر */}
      <div className="bg-[#15317E] text-white px-6 pt-10 pb-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-sm mb-1">لوحة تحكم</p>
          <h1 className="text-2xl font-bold mb-6">المسؤول العام 🛡️</h1>

          {/* الإحصائيات */}
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold">{members.length}</p>
                <p className="text-white/70 text-xs mt-1">عدد الأعضاء</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold">{properties.length}</p>
                <p className="text-white/70 text-xs mt-1">العقارات</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold">{venues.length}</p>
                <p className="text-white/70 text-xs mt-1">الشاليهات</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold">{bookings.length}</p>
                <p className="text-white/70 text-xs mt-1">الحجوزات</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* إحصائيات أنواع النشاط */}
        {!isLoading && (
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-3">توزيع الأعضاء حسب النشاط</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(businessTypes).map(([type, count]) => (
                <div key={type} className="flex items-center gap-2 bg-[#15317E]/5 px-4 py-2 rounded-xl">
                  <span className="text-sm font-bold text-[#15317E]">{type}</span>
                  <span className="text-xs bg-[#15317E] text-white px-2 py-0.5 rounded-full font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* البحث */}
        <div className="relative">
          <Search className="absolute right-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث..."
            className="w-full bg-white border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-sm focus:outline-none focus:border-[#15317E] shadow-sm"
          />
        </div>

        {/* التبويبات */}
        <div className="flex gap-2 flex-wrap">
          <Tab label="الأعضاء" active={activeTab === 'members'} onClick={() => setActiveTab('members')} count={members.length} />
          <Tab label="العقارات" active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} count={properties.length} />
          <Tab label="الشاليهات" active={activeTab === 'venues'} onClick={() => setActiveTab('venues')} count={venues.length} />
          <Tab label="الحجوزات" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} count={bookings.length} />
        </div>

        {/* ── الأعضاء ── */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            {filteredMembers.length === 0 ? (
              <p className="text-center text-slate-400 py-10">لا توجد نتائج</p>
            ) : filteredMembers.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#15317E]/10 flex items-center justify-center font-bold text-[#15317E] text-lg flex-shrink-0">
                    {(m.full_name || m.office_name || m.email || '?')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-800">{m.full_name || m.office_name || '—'}</p>
                      {m.business_type && (
                        <span className="text-xs bg-[#15317E]/10 text-[#15317E] px-2 py-0.5 rounded-full font-bold">{m.business_type}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</p>
                    {m.phone && <p className="text-sm text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</p>}
                    {m.city && <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{m.city}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── العقارات ── */}
        {activeTab === 'properties' && (
          <div className="space-y-3">
            {filteredProperties.length === 0 ? (
              <p className="text-center text-slate-400 py-10">لا توجد عقارات</p>
            ) : filteredProperties.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{p.title || p.name || '—'}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city || '—'}</p>
                </div>
                {p.price && (
                  <p className="font-bold text-[#15317E] text-sm">{Number(p.price).toLocaleString('ar-SA')} ر.س</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── الشاليهات ── */}
        {activeTab === 'venues' && (
          <div className="space-y-3">
            {filteredVenues.length === 0 ? (
              <p className="text-center text-slate-400 py-10">لا توجد شاليهات</p>
            ) : filteredVenues.map(v => (
              <div key={v.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex">
                {v.images?.[0] ? (
                  <img src={v.images[0]} alt={v.name} className="w-20 h-20 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Hotel className="w-6 h-6 text-blue-400" />
                  </div>
                )}
                <div className="p-3 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800">{v.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${v.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{v.city}</p>
                  {v.price_weekend && (
                    <p className="text-sm font-bold text-[#15317E] mt-0.5">{v.price_weekend?.toLocaleString('ar-SA')} ر.س / ويكند</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── الحجوزات ── */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <p className="text-center text-slate-400 py-10">لا توجد حجوزات</p>
            ) : filteredBookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-800">{b.guest_name || 'ضيف'}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    b.status === 'مؤكد' ? 'bg-emerald-100 text-emerald-700' :
                    b.status === 'جديد' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'ملغي' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{b.status || '—'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  {b.check_in && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />دخول: {b.check_in}</span>}
                  {b.check_out && <span>خروج: {b.check_out}</span>}
                  {b.total_price && <span className="font-bold text-[#15317E]">{Number(b.total_price).toLocaleString('ar-SA')} ر.س</span>}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
      ` }} />
    </div>
  );
}
