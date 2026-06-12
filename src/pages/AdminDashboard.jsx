import React, { useState } from 'react';
import logo from '../aqar-cloud-logo.png';
// AqarCloud Admin Airbnb Theme V5 - نفس تصميم البطاقات لكن أصغر وأخف
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44, supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building, CreditCard, Settings,
  Bell, Search, Menu, TrendingUp, Activity, Calendar,
  ChevronLeft, X, Wallet, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Clock, Loader2, Trash2, AlertTriangle,
  Home, Hotel, MapPin, Phone, Mail, Crown
} from 'lucide-react';
import { getSubscriptionState, computeNewEndDate, formatDate, PLANS } from '@/lib/subscription';

const ADMIN_EMAIL = 'sloom059@gmail.com';

// ── Sidebar Item ──
const SidebarItem = ({ icon, text, active = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all text-right ${
      active
        ? 'bg-[#FF385C] text-white font-black shadow-lg shadow-rose-200/70'
        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 font-bold'
    }`}
  >
    <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? 'bg-white/15' : 'bg-zinc-100'}`}>
      {icon}
    </span>
    <span className="text-sm">{text}</span>
  </button>
);

// ── Delete Modal ──
function DeleteModal({ member, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-[#FF385C] rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-[#2a4db3]">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-5 mx-auto border border-white/20">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
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

  if (isLoadingAuth) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-950" /></div>;
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

  const [activating, setActivating] = useState(null);

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

  // عدّاد المشتركين
  const subscribedCount = members.filter(m => {
    const s = getSubscriptionState(m);
    return s.status === 'active' || s.status === 'grace';
  }).length;
  const unsubscribedCount = members.length - subscribedCount;

  // إحصائيات KPIs
  const kpiStats = [
    { title: 'إجمالي الأعضاء', value: members.length.toLocaleString(), currency: 'عضو', trend: `+${members.filter(m=>{ const d=new Date(m.created_date||0); return Date.now()-d<7*86400000; }).length} هذا الأسبوع`, isPositive: true, icon: <Users className="w-6 h-6 text-zinc-950" />, bg: 'bg-blue-50' },
    { title: 'وسطاء عقاريين', value: brokers.length.toLocaleString(), currency: 'وسيط', trend: `${Math.round(brokers.length/Math.max(members.length,1)*100)}% من الأعضاء`, isPositive: true, icon: <Building className="w-6 h-6 text-amber-500" />, bg: 'bg-amber-50' },
    { title: 'ملاك شاليهات', value: owners.length.toLocaleString(), currency: 'مالك', trend: `${venues.length} شاليه مضاف`, isPositive: true, icon: <Hotel className="w-6 h-6 text-emerald-500" />, bg: 'bg-emerald-50' },
    { title: 'الحجوزات', value: bookings.length.toLocaleString(), currency: 'حجز', trend: `${bookings.filter(b=>b.status==='مؤكد').length} مؤكد`, isPositive: true, icon: <Calendar className="w-6 h-6 text-rose-500" />, bg: 'bg-rose-50' },
    { title: 'المشتركين', value: subscribedCount.toLocaleString(), currency: 'مشترك', trend: `${unsubscribedCount} غير مشترك`, isPositive: true, icon: <Crown className="w-6 h-6 text-amber-500" />, bg: 'bg-amber-50' },
  ];

  // فلترة
  const fm = members.filter(m => !search || m.email?.toLowerCase().includes(search.toLowerCase()) || m.full_name?.includes(search) || m.office_name?.includes(search));
  const fp = properties.filter(p => !search || p.title?.includes(search) || p.city?.includes(search));
  const fv = venues.filter(v => !search || v.name?.includes(search) || v.city?.includes(search));

  // تفعيل اشتراك لعضو (سنوي / نصف سنوي)
  const activateSubscription = async (member, plan) => {
    setActivating(member.id + plan);
    try {
      const newEnd = computeNewEndDate(member.subscription_end, plan);
      await supabase.from('profiles').update({
        subscription_plan: plan,
        subscription_end: newEnd.toISOString(),
        subscription_started: new Date().toISOString(),
      }).eq('id', member.id);

      // إشعار التجديد للعضو
      await supabase.from('notifications').insert({
        user_id: member.id,
        type: 'renewed',
        title: 'تم تجديد اشتراكك بنجاح! 🎉',
        body: `تم تفعيل الاشتراك ${PLANS[plan]?.label} حتى ${formatDate(newEnd)}. نوّرت!`,
      });

      qc.invalidateQueries({ queryKey: ['admin-members'] });
      showToast(`تم تفعيل اشتراك ${PLANS[plan]?.label} لـ ${member.office_name || member.full_name || member.email}`);
    } catch (e) {
      showToast('تعذّر التفعيل: ' + (e.message || ''));
    }
    setActivating(null);
  };

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

      // ٤. حذف كل شي عبر Database Function (تحذف Auth + كل البيانات)
      const { error: fnErr } = await supabase.rpc('delete_user_completely', {
        user_id: memberToDelete.id
      });
      if (fnErr) {
        // fallback: احذف الملف على الأقل
        await supabase.from('profiles').delete().eq('id', memberToDelete.id);
        showToast('حُذفت البيانات: ' + fnErr.message);
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
    <div dir="rtl" className="flex h-screen bg-[#F7F7F7] font-sans overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-zinc-950 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {memberToDelete && <DeleteModal member={memberToDelete} onConfirm={handleDelete} onCancel={() => setMemberToDelete(null)} loading={deleting} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-white text-zinc-950 border-l border-zinc-200 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl shadow-zinc-200/40 lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-zinc-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 overflow-hidden flex-shrink-0">
              <img src={logo} alt="عقار كلاود" className="w-10 h-10 object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black leading-tight text-zinc-950">عقار كلاود</h1>
              <p className="text-[11px] text-zinc-500 truncate">لوحة تحكم الإدارة</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-zinc-100 rounded-xl text-zinc-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto space-y-2">
          <p className="px-4 text-[10px] font-black text-zinc-400 mb-2 mt-2">القائمة</p>
          {tabs.map(t => (
            <SidebarItem key={t.id} icon={t.icon} text={t.label + (t.count !== undefined ? ` (${t.count})` : '')} active={activeTab === t.id}
              onClick={() => { setActiveTab(t.id); setIsSidebarOpen(false); }} />
          ))}
        </div>

        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center font-black text-sm text-white">م</div>
            <div className="min-w-0">
              <p className="text-sm font-black leading-tight text-zinc-950">المدير العام</p>
              <p className="text-[10px] text-zinc-500 truncate" dir="ltr">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />}

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/90 backdrop-blur h-20 px-4 md:px-6 flex items-center justify-between border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-200 rounded-full px-4 py-3 w-full max-w-md focus-within:ring-2 focus-within:ring-[#FF385C]/20 transition-all">
              <Search className="w-4 h-4 text-zinc-400 ml-2" />
              <input type="text" placeholder="ابحث عن عضو، عقار، أو شاليه..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-zinc-950">لوحة الإدارة</p>
              <p className="text-[10px] text-zinc-500">AqarCloud Admin</p>
            </div>
            <div className="w-11 h-11 bg-zinc-950 rounded-full flex items-center justify-center text-white font-black shadow-sm">م</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

          {/* ══ نظرة عامة ══ */}
          {activeTab === 'overview' && (
            <>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-black text-zinc-950 mb-1">ملخص عقار كلاود</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> بيانات حقيقية من قاعدة البيانات</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
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
                        <span className="text-3xl font-black text-zinc-950">{stat.value}</span>
                        <span className="text-xs font-medium text-slate-400">{stat.currency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                  <h3 className="text-lg font-black text-zinc-950 mb-6">توزيع الأعضاء</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-slate-700 flex items-center gap-2"><Building className="w-4 h-4 text-zinc-950" /> وسطاء عقاريين</span>
                        <span className="font-black text-zinc-950">{members.length ? Math.round(brokers.length/members.length*100) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div className="bg-[#FF385C] h-3 rounded-full transition-all" style={{ width: `${members.length ? brokers.length/members.length*100 : 0}%` }} />
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
                        <p className="text-xl font-black text-zinc-950 mb-1">{properties.length}</p>
                        <p className="text-[10px] font-bold text-slate-600">عقار</p>
                      </div>
                      <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-xl font-black text-zinc-950 mb-1">{venues.length}</p>
                        <p className="text-[10px] font-bold text-slate-600">شاليه</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-zinc-950">آخر الأعضاء المسجلين</h3>
                    <button onClick={() => setActiveTab('members')} className="text-sm font-bold text-zinc-950 bg-[#FF385C]/5 hover:bg-[#FF385C]/10 px-4 py-2 rounded-xl transition-colors">عرض الكل</button>
                  </div>
                  {loadingMembers ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-950" /></div> : (
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
                                <p className="font-bold text-zinc-950 text-xs">{m.office_name || m.full_name || '—'}</p>
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
                                  <Trash2 className="w-3.5 h-3.5" />
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
          {/* V5: بطاقات أعضاء أصغر من التصميم السابق بدون تغيير المنطق */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-zinc-100 p-4 md:p-5 overflow-hidden relative">
                <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#FF385C]/10 rounded-full blur-3xl" />
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF385C] text-white flex items-center justify-center shadow-lg shadow-rose-100">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#FF385C] mb-1">إدارة الاشتراكات</p>
                      <h3 className="text-xl font-black text-zinc-950">الأعضاء ({fm.length})</h3>
                      <p className="text-xs text-zinc-500 mt-1">اختر خطة نصف سنوية أو سنوية لأي عضو بنفس منطق التفعيل الحالي.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 min-w-[220px]">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                      <p className="text-[11px] font-black text-emerald-700">مشتركين</p>
                      <p className="text-xl font-black text-emerald-700 mt-1">{subscribedCount}</p>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3">
                      <p className="text-[11px] font-black text-rose-700">غير مشتركين</p>
                      <p className="text-xl font-black text-rose-700 mt-1">{unsubscribedCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {loadingMembers ? (
                <div className="bg-white rounded-[2rem] border border-zinc-100 p-16 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FF385C]" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
                  {fm.map(m => {
                    const s = getSubscriptionState(m);
                    const active = s.status === 'active' || s.status === 'grace';
                    const isBroker = m.business_type === 'وسيط' || m.office_name;
                    return (
                      <div key={m.id} className="group bg-white rounded-[1.5rem] border border-zinc-100 shadow-sm hover:shadow-lg hover:shadow-zinc-200/50 transition-all overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-950 font-black flex-shrink-0">
                                {(m.office_name || m.full_name || m.email || 'ع').slice(0, 1)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-black text-zinc-950 text-sm truncate">{m.office_name || m.full_name || 'بدون اسم'}</h4>
                                <p className="text-xs text-zinc-500 truncate" dir="ltr">{m.email}</p>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isBroker ? 'bg-zinc-100 text-zinc-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                    {m.business_type || (isBroker ? 'وسيط' : 'مالك')}
                                  </span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-50 text-zinc-500 border border-zinc-100">
                                    {m.city || 'بدون مدينة'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <span className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full ${active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                              {active ? 'مشترك' : 'غير مشترك'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                            <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                              <p className="text-[10px] font-black text-zinc-400 mb-1">الجوال</p>
                              <p className="text-xs font-bold text-zinc-700" dir="ltr">{m.phone || '—'}</p>
                            </div>
                            <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                              <p className="text-[10px] font-black text-zinc-400 mb-1">الخطة الحالية</p>
                              <p className="text-xs font-black text-zinc-950">{PLANS[s.plan]?.label || 'لا يوجد'}</p>
                            </div>
                            <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                              <p className="text-[10px] font-black text-zinc-400 mb-1">تاريخ الانتهاء</p>
                              <p className="text-xs font-black text-zinc-950">{s.endDate ? formatDate(s.endDate) : '—'}</p>
                            </div>
                          </div>

                          <div className="bg-[#FFF7F8] border border-rose-100 rounded-2xl p-3">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div>
                                <p className="text-[11px] font-black text-zinc-950">تفعيل / تمديد الاشتراك</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">نفس الدالة الحالية: تضيف المدة فوق المتبقي إذا كان عنده اشتراك.</p>
                              </div>
                              <Crown className="w-4 h-4 text-[#FF385C]" />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => activateSubscription(m, 'semi')}
                                disabled={activating === m.id + 'semi'}
                                className="h-10 rounded-xl bg-white border border-rose-100 text-zinc-950 font-black text-xs hover:border-[#FF385C] hover:text-[#FF385C] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                              >
                                {activating === m.id + 'semi' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                                نصف سنوي
                              </button>
                              <button
                                type="button"
                                onClick={() => activateSubscription(m, 'yearly')}
                                disabled={activating === m.id + 'yearly'}
                                className="h-10 rounded-xl bg-[#FF385C] text-white font-black text-xs hover:bg-[#E31C5F] transition-all disabled:opacity-50 shadow-md shadow-rose-200/70 flex items-center justify-center gap-1.5"
                              >
                                {activating === m.id + 'yearly' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                سنوي
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-end pt-3">
                            <button onClick={() => setMemberToDelete(m)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> حذف العضو
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ العقارات ══ */}
          {activeTab === 'properties' && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
              <h3 className="text-lg font-black text-zinc-950 mb-6">العقارات المضافة ({fp.length})</h3>
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
                        <td className="px-4 py-3 font-bold text-zinc-950 text-xs max-w-[200px] truncate">{p.title || '—'}</td>
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
              <h3 className="text-lg font-black text-zinc-950 mb-6">الشاليهات ({fv.length})</h3>
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
                        <td className="px-4 py-3 font-bold text-zinc-950 text-xs">{v.name || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{v.venue_type || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{v.city || '—'}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-700">{v.price_weekday ? v.price_weekday.toLocaleString() + ' ر.س' : '—'}</td>
                        <td className="px-4 py-3 text-xs text-zinc-950" dir="ltr">{v.slug || v.id?.slice(0, 8)}</td>
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
              <h3 className="text-lg font-black text-zinc-950 mb-6">الحجوزات ({bookings.length})</h3>
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
                        <td className="px-4 py-3 font-bold text-zinc-950 text-xs">{b.client_name || '—'}</td>
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
