import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  MapPin, 
  CheckCircle,
  Wallet,
  LogOut
} from 'lucide-react';

const App = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [showRevenue, setShowRevenue] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // تم تحويلها إلى State لنتمكن من حذف الشاليهات فعلياً من الواجهة
  const [chaletsList, setChaletsList] = useState([
    {
      id: 1,
      name: 'شاليه سيمفوني الفاخر',
      location: 'الرياض، حي الرمال',
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
      status: 'متاح الآن',
      statusType: 'active',
      price: '1,200',
      bookings: 12
    },
    {
      id: 2,
      name: 'فيلا أواسيس المائية',
      location: 'جدة، أبحر الشمالية',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      status: 'محجوز',
      statusType: 'busy',
      price: '1,500',
      bookings: 8
    },
    {
      id: 3,
      name: 'منتجع الغروب الخاص',
      location: 'الدمام، الهاف مون',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
      status: 'إيقاف مؤقت',
      statusType: 'stopped',
      price: '900',
      bookings: 0
    }
  ]);

  const handleShare = () => {
    setToastMessage('تم نسخ الرابط بنجاح!');
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const confirmDelete = () => {
    // إزالة الشاليه من القائمة
    setChaletsList(prev => prev.filter(chalet => chalet.id !== itemToDelete.id));
    setItemToDelete(null);
    
    // إظهار إشعار النجاح
    setToastMessage('تم حذف الوحدة بنجاح!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getStatusBadge = (type, text) => {
    const styles = {
      active: 'bg-white/20 text-white backdrop-blur-md border border-white/30',
      busy: 'bg-amber-500/90 text-white backdrop-blur-md border border-amber-400/50',
      stopped: 'bg-rose-500/90 text-white backdrop-blur-md border border-rose-400/50'
    };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${styles[type]}`}>
        {text}
      </span>
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">
      
      {/* إشعار منبثق (Toast) */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#15317E] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-[#0d1e4c]">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* نافذة تأكيد الحذف الفاخرة (Modal) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#15317E] rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-[#2a4db3] transform scale-100 animate-in zoom-in-95">
            
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-5 mx-auto border border-white/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-center text-white mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-white/70 text-center mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف <br/>
              <span className="text-emerald-400 font-bold text-base">{itemToDelete.name}</span>؟<br/>
              <span className="text-xs opacity-60">لا يمكن التراجع عن هذا الإجراء لاحقاً.</span>
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm"
              >
                تراجع
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all border border-rose-400 text-sm"
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الهيدر الممتد */}
      <div className="absolute top-0 left-0 right-0 h-[190px] bg-[#15317E] rounded-b-[2.5rem] shadow-lg"></div>

      <div className="relative z-10 max-w-md mx-auto">
        
        {/* الشريط العلوي */}
        <header className="px-5 pt-8 pb-6 flex items-center justify-between text-white relative">
          
          {/* بيانات المالك */}
          <div className="flex items-center gap-3">
            <div className="relative p-0.5 bg-white/10 rounded-2xl backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" 
                alt="Profile" 
                className="w-11 h-11 rounded-xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#15317E] rounded-full"></div>
            </div>
            <div>
              <p className="text-[11px] text-white/70 mb-0.5 tracking-wider">مرحباً بك،</p>
              <h1 className="text-base font-bold">أ. خالد عبدالله</h1>
            </div>
          </div>
          
          {/* أيقونات التحكم العلوية (تم ترتيبها: إشعارات، محفظة، خروج) */}
          <div className="flex items-center gap-2 relative">
            
            {/* 1. الإشعارات (يمين) */}
            <button className="relative p-2.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all text-white/90 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
            </button>

            {/* 2. الإيرادات (بالمنتصف) */}
            <div className="relative">
              <button 
                onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${showRevenue ? 'bg-white text-[#15317E]' : 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white'}`}
                title="إجمالي الإيرادات"
              >
                <Wallet className="w-4 h-4" />
              </button>

              {/* نافذة الإيرادات */}
              {showRevenue && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-2xl shadow-xl shadow-[#15317E]/10 border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 text-center">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">إجمالي إيرادات الشهر</p>
                  <p className="text-xl font-bold text-[#15317E]">24,500 <span className="text-[10px] font-normal text-slate-400">ر.س</span></p>
                </div>
              )}
            </div>

            {/* 3. الخروج (يسار) */}
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all text-white/90 hover:text-white" title="تسجيل الخروج">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* منطقة المحتوى والبطاقات */}
        <main className="px-4 space-y-6 mt-4">
          
          <div className="flex items-center justify-between px-2 text-white mb-4">
            <h3 className="text-lg font-bold">وحداتي السكنية</h3>
            
            <div className="flex items-center gap-2.5">
              <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
                {chaletsList.length} وحدات
              </span>
              
              {/* زر إضافة شاليه الفاخر */}
              <button className="flex items-center gap-1.5 bg-white text-[#15317E] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 group cursor-pointer">
                <div className="bg-[#15317E]/10 rounded-full p-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                إضافة شاليه
              </button>
            </div>
          </div>

          {/* بطاقات الشاليهات */}
          {chaletsList.map((chalet) => (
            <div key={chalet.id} className="bg-white rounded-[2rem] p-2 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300">
              
              {/* قسم الصورة */}
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden">
                <img src={chalet.image} alt={chalet.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15317E]/90 via-[#15317E]/30 to-transparent"></div>
                
                {/* شارات الحالة */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {getStatusBadge(chalet.statusType, chalet.status)}
                </div>

                {/* النصوص على الصورة */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1 shadow-sm">{chalet.name}</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {chalet.location}
                  </p>
                </div>
              </div>

              {/* قسم الأسعار والمعلومات */}
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5 font-medium">السعر لليلة</p>
                  <p className="text-lg font-bold text-[#15317E]">{chalet.price} <span className="text-xs font-normal text-slate-400">ر.س</span></p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 mb-0.5 font-medium">حجوزات الشهر</p>
                  <p className="text-lg font-bold text-[#15317E]">{chalet.bookings}</p>
                </div>
              </div>

              {/* شريط الإجراءات الذكي (SVGs مخصصة وفخمة) */}
              <div className="bg-slate-50 rounded-[1.2rem] p-2 flex gap-2">
                <button className="flex-1 bg-[#15317E] hover:bg-[#0d1e4c] text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#15317E]/20">
                  <Calendar className="w-5 h-5" />
                  إدارة الحجوزات
                </button>

                <div className="flex gap-2">
                  
                  {/* زر التعديل (SVG مخصص) */}
                  <button className="w-12 flex items-center justify-center bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-xl transition-all shadow-sm group" title="تعديل">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                  </button>
                  
                  {/* زر المشاركة (SVG مخصص) */}
                  <button onClick={handleShare} className="w-12 flex items-center justify-center bg-white text-[#15317E] border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl transition-all shadow-sm group" title="مشاركة">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="10.49" x2="8.59" y2="6.51"/>
                    </svg>
                  </button>
                  
                  {/* زر الحذف (SVG مخصص مع رسالة تأكيد) */}
                  <button onClick={() => setItemToDelete(chalet)} className="w-12 flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl transition-all shadow-sm group" title="حذف الشاليه">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>

                </div>
              </div>

            </div>
          ))}

          {/* حالة عدم وجود شاليهات */}
          {chaletsList.length === 0 && (
             <div className="text-center py-10">
               <p className="text-slate-500 font-medium">لا توجد وحدات سكنية حالياً.</p>
             </div>
          )}
        </main>
      </div>

      {/* الخطوط */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        body {
          font-family: 'Tajawal', sans-serif;
        }
      `}} />
    </div>
  );
};

export default App;
