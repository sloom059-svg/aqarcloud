import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44, supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, Users, Home, CalendarDays, TrendingUp, Search, MapPin, Phone, Mail, Building2, Hotel, Trash2, AlertTriangle } from 'lucide-react';

const ADMIN_EMAIL = 'sloom059@gmail.com';

const Tab = ({ label, active, onClick, count }) => (
  <button onClick={onClick} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${active ? 'bg-[#15317E] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
    {label}
    {count !== undefined && <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{count}</span>}
  </button>
);

// ── Modal تأكيد الحذف ──
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
          مع جميع صوره من Storage
        </p>
        <p className="text-xs text-rose-300 text-center mb-6 bg-white/5 rounded-xl p-2">
          ⚠️ لا يمكن التراجع عن هذا الإجراء
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm">تراجع</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all border border-rose-400 text-sm disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'نعم، احذف نهائياً'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [search, setSearch] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');
  const qc = useQueryClient();

  if (isLoadingAuth) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#15317E]" /></div>;
  if (user?.email !== ADMIN_EMAIL) return <Navigate to="/" replace />;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return <AdminContent
    activeTab={activeTab} setActiveTab={setActiveTab}
    search={search} setSearch={setSearch}
    memberToDelete={memberToDelete} setMemberToDelete={setMemberToDelete}
    deleting={deleting} setDeleting={setDeleting}
    toast={toast} showToast={showToast} qc={qc}
  />;
}

function AdminContent({ activeTab, setActiveTab, search, setSearch, memberToDelete, setMemberToDelete, deleting, setDeleting, toast, showToast, qc }) {

  const { data: members = [], isLoading: lm } = useQuery({
    queryKey: ['admin-members'],
    queryFn: async () => { const { data } = await supabase.from('profiles').select('*').order('id'); return data || []; },
  });
  const { data: properties = [], isLoading: lp } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => { const { data } = await supabase.from('property').select('*').order('created_at', { ascending: false }); return data || []; },
  });
  const { data: venues = [], isLoading: lv } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: async () => { const { data } = await supabase.from('venue').select('*').order('created_at', { ascending: false }); return data || []; },
  });
  const { data: bookings = [], isLoading: lb } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => { const { data } = await supabase.from('booking').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const isLoading = lm || lp || lv || lb;

  // ── حذف العضو مع صوره ──
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      // 1. جمع كل صور العضو من الشاليهات والعقارات والبروفايل
      const memberVenues = venues.filter(v => v.owner_id === memberToDelete.id);
      const memberProps = properties.filter(p => p.owner_id === memberToDelete.id || p.created_by_id === memberToDelete.id);

      const allImageUrls = [
        ...(memberVenues.flatMap(v => v.images || [])),
        ...(memberProps.flatMap(p => p.images || [])),
        memberToDelete.avatar_url,
        memberToDelete.office_logo_url,
      ].filter(Boolean);

      // 2. حذف الصور من Storage
      if (allImageUrls.length > 0) {
        await base44.integrations.Core.DeleteFiles(allImageUrls);
      }

      // 3. حذف البروفايل
      await supabase.from('profiles').delete().eq('id', memberToDelete.id);

      // 4. حذف حساب المصادقة عبر Supabase Admin API
      await supabase.auth.admin.deleteUser(memberToDelete.id);

      // 5. تحديث القوائم
      qc.invalidateQueries({ queryKey: ['admin-members'] });
      qc.invalidateQueries({ queryKey: ['admin-venues'] });
      qc.invalidateQueries({ queryKey: ['admin-properties'] });

      showToast(`تم حذف ${memberToDelete.email} بنجاح ✅`);
      setMemberToDelete(null);
    } catch (err) {
      showToast('حدث خطأ: ' + (err?.message || 'تعذّر الحذف'));
    } finally {
      setDeleting(false);
    }
  };

  const fm = members.filter(m => m.email?.toLowerCase().includes(search.toLowerCase()) || m.full_name?.includes(search) || m.office_name?.includes(search));
  const fp = properties.filter(p => p.title?.includes(search) || p.city?.includes(search));
  const fv = venues.filter(v => v.name?.includes(search) || v.city?.includes(search));
  const fb = bookings.filter(b => b.guest_name?.includes(search) || b.status?.includes(search));

  const businessTypes = members.reduce((acc, m) => { const t = m.business_type || 'غير محدد'; acc[t] = (acc[t] || 0) + 1; return acc; }, {});

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC]">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#15317E] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#0d1e4c]">
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Modal الحذف */}
      {memberToDelete && (
        <DeleteModal
          member={memberToDelete}
          onConfirm={handleDeleteMember}
          onCancel={() => setMemberToDelete(null)}
          loading={deleting}
        />
      )}

      {/* الهيدر */}
      <div className="bg-[#15317E] text-white px-6 pt-10 pb-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-sm mb-1">لوحة تحكم</p>
          <h1 className="text-2xl font-bold mb-6">المسؤول العام 🛡️</h1>
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'عدد الأعضاء', value: members.length },
                { label: 'العقارات', value: properties.length },
                { label: 'الشاليهات', value: venues.length },
                { label: 'الحجوزات', value: bookings.length },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-white/70 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* توزيع الأعضاء */}
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="w-full bg-white border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-sm focus:outline-none focus:border-[#15317E] shadow-sm" />
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
            {fm.length === 0 ? <p className="text-center text-slate-400 py-10">لا توجد نتائج</p> : fm.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#15317E]/10 flex items-center justify-center font-bold text-[#15317E] text-lg flex-shrink-0">
                    {(m.full_name || m.office_name || m.email || '?')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-800">{m.full_name || m.office_name || '—'}</p>
                      {m.business_type && <span className="text-xs bg-[#15317E]/10 text-[#15317E] px-2 py-0.5 rounded-full font-bold">{m.business_type}</span>}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</p>
                    {m.phone && <p className="text-sm text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</p>}
                    {m.city && <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{m.city}</p>}
                  </div>
                  {/* زر الحذف */}
                  {m.email !== ADMIN_EMAIL && (
                    <button
                      onClick={() => setMemberToDelete(m)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all flex-shrink-0"
                      title="حذف العضو"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── العقارات ── */}
        {activeTab === 'properties' && (
          <div className="space-y-3">
            {fp.length === 0 ? <p className="text-center text-slate-400 py-10">لا توجد عقارات</p> : fp.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{p.title || p.name || '—'}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city || '—'}</p>
                </div>
                {p.price && <p className="font-bold text-[#15317E] text-sm">{Number(p.price).toLocaleString('ar-SA')} ر.س</p>}
              </div>
            ))}
          </div>
        )}

        {/* ── الشاليهات ── */}
        {activeTab === 'venues' && (
          <div className="space-y-3">
            {fv.length === 0 ? <p className="text-center text-slate-400 py-10">لا توجد شاليهات</p> : fv.map(v => (
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${v.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{v.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{v.city}</p>
                  {v.price_weekend && <p className="text-sm font-bold text-[#15317E] mt-0.5">{v.price_weekend?.toLocaleString('ar-SA')} ر.س / ويكند</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── الحجوزات ── */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {fb.length === 0 ? <p className="text-center text-slate-400 py-10">لا توجد حجوزات</p> : fb.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-800">{b.guest_name || 'ضيف'}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${b.status === 'مؤكد' ? 'bg-emerald-100 text-emerald-700' : b.status === 'جديد' ? 'bg-blue-100 text-blue-700' : b.status === 'ملغي' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{b.status || '—'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
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
