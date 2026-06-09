import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44, supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building, CreditCard, Settings,
  Bell, Search, Menu, TrendingUp, Activity, Calendar,
  ChevronLeft, X, Wallet, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Clock, Loader2, Trash2, AlertTriangle,
  Home, Hotel, MapPin, Phone, Mail
} from 'lucide-react';

const ADMIN_EMAIL = 'sloom059@gmail.com';

// ── Sidebar Item ──
const SidebarItem = ({ icon, text, active = false, onClick }) => (
  <div onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
    {icon}
    <span className="text-sm">{text}</span>
  </div>
);

// ── Delete Modal ──
function DeleteModal({ member, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-[#15317E] rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-[#2a4db3]">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-5 mx-auto border border-white/20">
          <AlertTriangle className="w-7 h-7 text-rose-400" />
        </div>
        <h3 className="text-xl font-bold text-center text-white mb-2">تأكيد الحذف النهائي</h3>
        <p className="text-sm text-white/70 text-center mb-2 leading-relaxed">
          سيتم حذف عضوية<br />
          <span className="text-emerald-400 font-bold text-base">{member?.email}</span><br />
          مع جميع بياناته
        </p>
        <p className="text-xs text-rose-300 text-center mb-6 bg-white/5 rounded-xl p-2">لا يمكن التراجع عن هذا الإجراء</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm">تراجع</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all text-sm disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'احذف نهائياً'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoadingAuth } = useAuth();
  const qc = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  if (isLoadingAuth) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>;
  if (user?.email !== ADMIN_EMAIL) return <Navigate to="/" replace />;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return <AdminContent
    user={user} qc={qc}
    isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
    activeTab={activeTab} setActiveTab={setActiveTab}
    search={search} setSearch={setSearch}
    memberToDelete={memberToDelete} setMemberToDelete={setMemberToDelete}
    deleting={deleting} setDeleting={setDeleting}
    toast={toast} showToast={showToast}
  />;
}

function AdminContent({ user, qc, isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, search, setSearch, memberToDelete, setMemberToDelete, deleting, setDeleting, toast, showToast }) {

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ['admin-members'], queryFn: () => base44.entities.User.filter({}),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ['admin-properties'], queryFn: () => base44.entities.Property.filter({}),
  });
  const { data: venues = [] } = useQuery({
    queryKey: ['admin-venues'], queryFn: () => base44.entities.Venue.filter({}),
  });
  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'], queryFn: () => base44.entities.Booking.filter({}),
  });

  const brokers = members.filter(m => m.business_type === 'وسيط' || (!m.business_type && m.office_name));
  const owners = members.filter(m => m.business_type && m.business_type !== 'وسيط');

  // إحصائيات KPIs
  const kpiStats = [
    { title: 'إجمالي الأعضاء', value: members.length.toLocaleString(), currency: 'عضو', trend: `+${members.filter(m=>{ const d=new Date(m.created_date||0); return Date.now()-d<7*86400000; }).length} هذا الأسبوع`, isPositive: true, icon: <Users className="w-6 h-6 text-[#15317E]" />, bg: 'bg-blue-50' },
    { title: 'وسطاء عقاريين', value: brokers.length.toLocaleString(), currency: 'وسيط', trend: `${Math.round(brokers.length/Math.max(members.length,1)*100)}% من الأعضاء`, isPositive: true, icon: <Building className="w-6 h-6 text-amber-500" />, bg: 'bg-amber-50' },
    { title: 'ملاك شاليهات', value: owners.length.toLocaleString(), currency: 'مالك', trend: `${venues.length} شاليه مضاف`, isPositive: true, icon: <Hotel className="w-6 h-6 text-emerald-500" />, bg: 'bg-emerald-50' },
    { title: 'الحجوزات', value: bookings.length.toLocaleString(), currency: 'حجز', trend: `${bookings.filter(b=>b.status==='مؤكد').length} مؤكد`, isPositive: true, icon: <Calendar className="w-6 h-6 text-rose-500" />, bg: 'bg-rose-50' },
  ];

  // فلترة
  const fm = members.filter(m => !search || m.email?.toLowerCase().includes(search.toLowerCase()) || m.full_name?.includes(search) || m.office_name?.includes(search));
  const fp = properties.filter(p => !search || p.title?.includes(search) || p.city?.includes(search));
  const fv = venues.filter(v => !search || v.name?.includes(search) || v.city?.includes(search));

  // حذف عضو
  const handleDelete = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      const memberVenues = venues.filter(v => v.owner_id === memberToDelete.id);
      const memberProps = properties.filter(p => p.owner_id === memberToDelete.id || p.created_by_id === memberToDelete.id);

      // ١. حذف الصور من التخزين
      const imageUrls = [
        ...(memberVenues.flatMap(v => v.images || [])),
        ...(memberProps.flatMap(p => p.images || [])),
        memberToDelete.office_logo_url,
        memberToDelete.avatar_url,
        memberToDelete.profile_image_url,
      ].filter(Boolean);
      for (const url of imageUrls) {
        try { await base44.integrations.Core.DeleteFile(url); } catch (_) {}
      }

      // ٢. حذف الحجوزات المرتبطة بالشاليهات
      const memberBookings = bookings.filter(b => memberVenues.some(v => v.id === b.venue_id) || b.owner_id === memberToDelete.id);
      for (const b of memberBookings) {
        try { await base44.entities.Booking.delete(b.id); } catch (_) {}
      }

      // ٣. حذف الشاليهات والعقارات
      for (const v of memberVenues) { try { await base44.entities.Venue.delete(v.id); } catch (_) {} }
      for (const p of memberProps) { try { await base44.entities.Property.delete(p.id); } catch (_) {} }

      // ٤. حذف الملف الشخصي + حساب Auth عبر Edge Function
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://unptzucothzejcgntmpi.supabase.co';
        const functionUrl = `${supabaseUrl}/functions/v1/delete-member`;
        console.log('🔥 Edge Function URL:', functionUrl);
        console.log('🔥 userId:', memberToDelete.id);
        console.log('🔥 session token:', session?.access_token ? 'موجود' : 'غير موجود');
        
        const res = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          },
          body: JSON.stringify({ userId: memberToDelete.id }),
        });
        
        const result = await res.json();
        if (!res.ok) {
          // fallback: احذف الملف مباشرة على الأقل
          await supabase.from('profiles').delete().eq('id', memberToDelete.id);
          showToast('حُذفت البيانات فقط: ' + (result?.error || ''));
          qc.invalidateQueries({ queryKey: ['admin-members'] });
          setDeleting(false);
          setMemberToDelete(null);
          return;
        }
      } catch (e) {
        // fallback: احذف الملف مباشرة
        try { await supabase.from('profiles').delete().eq('id', memberToDelete.id); } catch (_) {}
      }

      qc.invalidateQueries({ queryKey: ['admin-members'] });
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
      qc.invalidateQueries({ queryKey: ['admin-venues'] });
      qc.invalidateQueries({ queryKey: ['admin-properties'] });
      showToast('تم حذف العضو وجميع بياناته نهائياً');
    } catch (e) {
      showToast('حدث خطأ أثناء الحذف: ' + (e?.message || ''));
    }
    setDeleting(false);
    setMemberToDelete(null);
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'members', label: 'الأعضاء', icon: <Users className="w-5 h-5" />, count: members.length },
    { id: 'properties', label: 'العقارات', icon: <Home className="w-5 h-5" />, count: properties.length },
    { id: 'venues', label: 'الشاليهات', icon: <Hotel className="w-5 h-5" />, count: venues.length },
    { id: 'bookings', label: 'الحجوزات', icon: <Calendar className="w-5 h-5" />, count: bookings.length },
  ];

  return (
    <div dir="rtl" className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-[#15317E] text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {memberToDelete && <DeleteModal member={memberToDelete} onConfirm={handleDelete} onCancel={() => setMemberToDelete(null)} loading={deleting} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-[#15317E] text-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Building className="w-6 h-6 text-[#15317E]" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">منصة كنترول</h1>
              <p className="text-[10px] text-white/70">لوحة تحكم الإدارة</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto space-y-1">
          <p className="px-4 text-[10px] font-bold text-white/50 mb-2 mt-4">الرئيسية</p>
          {tabs.map(t => (
            <SidebarItem key={t.id} icon={t.icon} text={t.label + (t.count !== undefined ? ` (${t.count})` : '')} active={activeTab === t.id}
              onClick={() => { setActiveTab(t.id); setIsSidebarOpen(false); }} />
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center font-bold text-sm">م</div>
            <div>
              <p className="text-sm font-bold leading-tight">المدير العام</p>
              <p className="text-[10px] text-white/60">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />}

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-20 px-6 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 w-80 focus-within:ring-2 focus-within:ring-[#15317E]/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input type="text" placeholder="ابحث عن عضو، عقار، أو شاليه..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#15317E] rounded-full flex items-center justify-center text-white font-bold shadow-sm">م</div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-[#15317E]">المدير العام</p>
              <p className="text-[10px] text-slate-500">Admin</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

          {/* ══ نظرة عامة ══ */}
          {activeTab === 'overview' && (
            <>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#15317E] mb-1">ملخص المنصة</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> بيانات حقيقية من قاعدة البيانات</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpiStats.map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                        <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">{stat.title}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-[#15317E]">{stat.value}</span>
                        <span className="text-xs font-medium text-slate-400">{stat.currency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                  <h3 className="text-lg font-black text-[#15317E] mb-6">توزيع الأعضاء</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-slate-700 flex items-center gap-2"><Building className="w-4 h-4 text-[#15317E]" /> وسطاء عقاريين</span>
                        <span className="font-black text-[#15317E]">{members.length ? Math.round(brokers.length/members.length*100) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div className="bg-[#15317E] h-3 rounded-full transition-all" style={{ width: `${members.length ? brokers.length/members.length*100 : 0}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5">{brokers.length} وسيط</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-slate-700 flex items-center gap-2"><Hotel className="w-4 h-4 text-emerald-500" /> ملاك شاليهات</span>
                        <span className="font-black text-emerald-600">{members.length ? Math.round(owners.length/members.length*100) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${members.length ? owners.length/members.length*100 : 0}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5">{owners.length} مالك</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 mb-4">الإحصائيات</h4>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-2xl font-black text-[#15317E] mb-1">{properties.length}</p>
                        <p className="text-[10px] font-bold text-slate-600">عقار</p>
                      </div>
                      <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-2xl font-black text-[#15317E] mb-1">{venues.length}</p>
                        <p className="text-[10px] font-bold text-slate-600">شاليه</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-[#15317E]">آخر الأعضاء المسجلين</h3>
                    <button onClick={() => setActiveTab('members')} className="text-sm font-bold text-[#15317E] bg-[#15317E]/5 hover:bg-[#15317E]/10 px-4 py-2 rounded-xl transition-colors">عرض الكل</button>
                  </div>
                  {loadingMembers ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#15317E]" /></div> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 rounded-r-xl font-bold">الاسم</th>
                            <th className="px-4 py-3 font-bold">التصنيف</th>
                            <th className="px-4 py-3 font-bold">المدينة</th>
                            <th className="px-4 py-3 rounded-l-xl font-bold">الإجراء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.slice(0, 6).map(m => (
                            <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-bold text-[#15317E] text-xs">{m.office_name || m.full_name || '—'}</p>
                                <p className="text-[10px] text-slate-400">{m.email}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.business_type === 'وسيط' || m.office_name ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                  {m.business_type || (m.office_name ? 'وسيط' : 'مالك')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-500">{m.city || '—'}</td>
                              <td className="px-4 py-3">
                                <button onClick={() => setMemberToDelete(m)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ══ الأعضاء ══ */}
          {activeTab === 'members' && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
              <h3 className="text-lg font-black text-[#15317E] mb-6">جميع الأعضاء ({fm.length})</h3>
              {loadingMembers ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="text-xs text-slate-500 bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 rounded-r-xl font-bold">الاسم / المكتب</th>
                        <th className="px-4 py-3 font-bold">البريد</th>
                        <th className="px-4 py-3 font-bold">الجوال</th>
                        <th className="px-4 py-3 font-bold">التصنيف</th>
                        <th className="px-4 py-3 font-bold">المدينة</th>
                        <th className="px-4 py-3 rounded-l-xl font-bold">حذف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fm.map(m => (
                        <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-[#15317E] text-xs">{m.office_name || m.full_name || '—'}</td>
                          <td className="px-4 py-3 text-xs text-slate-500" dir="ltr">{m.email}</td>
                          <td className="px-4 py-3 text-xs text-slate-500" dir="ltr">{m.phone || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.business_type === 'وسيط' || m.office_name ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                              {m.business_type || (m.office_name ? 'وسيط' : '—')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{m.city || '—'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => setMemberToDelete(m)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══ العقارات ══ */}
          {activeTab === 'properties' && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
              <h3 className="text-lg font-black text-[#15317E] mb-6">العقارات المضافة ({fp.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-slate-500 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-r-xl font-bold">العنوان</th>
                      <th className="px-4 py-3 font-bold">النوع</th>
                      <th className="px-4 py-3 font-bold">المدينة</th>
                      <th className="px-4 py-3 font-bold">السعر</th>
                      <th className="px-4 py-3 rounded-l-xl font-bold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fp.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-[#15317E] text-xs max-w-[200px] truncate">{p.title || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{p.type || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{p.city || '—'}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-700">{p.price_negotiable ? 'على السوم' : (p.price ? p.price.toLocaleString() + ' ر.س' : '—')}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{p.status || '—'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ الشاليهات ══ */}
          {activeTab === 'venues' && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
              <h3 className="text-lg font-black text-[#15317E] mb-6">الشاليهات ({fv.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-slate-500 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-r-xl font-bold">الاسم</th>
                      <th className="px-4 py-3 font-bold">النوع</th>
                      <th className="px-4 py-3 font-bold">المدينة</th>
                      <th className="px-4 py-3 font-bold">السعر/الليلة</th>
                      <th className="px-4 py-3 rounded-l-xl font-bold">الرابط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fv.map(v => (
                      <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-[#15317E] text-xs">{v.name || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{v.venue_type || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{v.city || '—'}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-700">{v.price_weekday ? v.price_weekday.toLocaleString() + ' ر.س' : '—'}</td>
                        <td className="px-4 py-3 text-xs text-[#15317E]" dir="ltr">{v.slug || v.id?.slice(0, 8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ الحجوزات ══ */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
              <h3 className="text-lg font-black text-[#15317E] mb-6">الحجوزات ({bookings.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-slate-500 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-r-xl font-bold">اسم الضيف</th>
                      <th className="px-4 py-3 font-bold">الجوال</th>
                      <th className="px-4 py-3 font-bold">الدخول</th>
                      <th className="px-4 py-3 font-bold">الخروج</th>
                      <th className="px-4 py-3 rounded-l-xl font-bold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 50).map(b => (
                      <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-[#15317E] text-xs">{b.client_name || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500" dir="ltr">{b.client_phone || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{b.check_in || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{b.check_out || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === 'مؤكد' ? 'bg-emerald-50 text-emerald-700' : b.status === 'ملغي' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{b.status || '—'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
