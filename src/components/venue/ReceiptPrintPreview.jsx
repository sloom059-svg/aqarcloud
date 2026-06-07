import React from 'react';
import { Printer, X, FileText, Globe, MapPin, QrCode, CheckCircle2 } from 'lucide-react';

const ReceiptPrintPreview = ({ show, onClose, booking, receiptForm, venueData }) => {
  if (!show || !booking) return null;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('ar-SA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-slate-800/90 backdrop-blur-sm overflow-y-auto overflow-x-auto print:bg-white print:p-0 flex flex-col items-center py-10 print:py-0 print:block" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        
        <div className="sticky top-4 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-slate-200 print:hidden mb-6">
           <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#15317E] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#0d1e4c] transition-all shadow-sm">
             <Printer className="w-4 h-4" />
             طباعة وحفظ كـ PDF
           </button>
           <button onClick={onClose} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
             <X className="w-4 h-4" />
             إغلاق المعاينة
           </button>
        </div>

        <div dir="rtl" className="w-[210mm] min-h-[297mm] shrink-0 bg-white text-slate-900 relative shadow-2xl print:shadow-none flex flex-col print:w-full print:h-full" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          
          <div className="absolute inset-3 border-2 border-[#15317E] rounded-2xl pointer-events-none"></div>
          <div className="absolute inset-4 border border-[#15317E]/30 rounded-xl pointer-events-none"></div>

          <div className="px-12 pt-14 pb-8 flex flex-col flex-1">
            
            <div className="flex justify-between items-start mb-12">
              <div className="flex items-center gap-4">
                
                {venueData?.logoUrl ? (
                   <img 
                     src={venueData.logoUrl} 
                     alt={`شعار ${venueData?.name}`} 
                     className="w-14 h-14 rounded-2xl shadow-md border border-white outline outline-2 outline-[#15317E] object-cover"
                   />
                ) : (
                  <div className="w-14 h-14 bg-[#15317E] rounded-2xl flex items-center justify-center text-white rotate-3 shadow-md border border-white outline outline-2 outline-[#15317E]">
                    <FileText className="w-6 h-6 -rotate-3" />
                  </div>
                )}

                <div>
                  <h1 className="text-2xl font-black text-[#15317E] mb-1">
                    {venueData?.name || 'اسم الشاليه'}
                  </h1>
                  <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Receipt Voucher</p>
                </div>
              </div>
              <div className="text-left border-r-4 border-[#15317E] pr-5">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">سند إستلام</h2>
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-bold text-slate-600 flex justify-end gap-1.5">
                    <span>التاريخ:</span>
                    <span dir="rtl">{formattedDate}</span>
                  </p>
                  <p className="text-xs font-bold text-slate-600">رقم المرجع: <span dir="ltr">{booking?.id}</span></p>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-l from-transparent via-[#15317E]/20 to-transparent mb-10"></div>

            <div className="px-2 space-y-8">
              <div className="flex items-baseline gap-4 border-b-2 border-slate-100 pb-4">
                <span className="text-lg font-bold text-slate-500 min-w-[120px]">استلمنا من السيد/ة:</span>
                <span className="text-xl font-black text-[#15317E]">{booking?.name}</span>
              </div>

              <div className="flex items-baseline gap-4 border-b-2 border-slate-100 pb-4">
                <span className="text-lg font-bold text-slate-500 min-w-[120px]">مبلغ وقدره:</span>
                <span className="text-2xl font-black text-slate-800">{receiptForm?.amount || '0'} <span className="text-sm font-bold text-slate-500">ريال سعودي</span></span>
              </div>

              <div className="flex items-baseline gap-4 border-b-2 border-slate-100 pb-4">
                <span className="text-lg font-bold text-slate-500 min-w-[120px]">وذلك عبارة عن:</span>
                <span className="text-lg font-bold text-slate-800 leading-relaxed">
                  {receiptForm?.type === 'deposit' ? 'عربون حجز' : receiptForm?.type === 'partial' ? 'دفعة من حساب الحجز' : 'تسوية كامل قيمة الحجز'}
                  {' '} - {' '}
                  للفترة من وإلى: <span dir="ltr" className="inline-block px-1">{booking?.date}</span>
                  {' '} ({booking?.nights})
                </span>
              </div>
            </div>

            <div className="mt-12 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-[#15317E] mb-3 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                الشروط والأحكام
              </h4>
              <ul className="text-sm font-medium text-slate-600 space-y-2 list-disc list-inside">
                <li>هذا السند يثبت استلام المبلغ الموضح أعلاه فقط ولا يمثل تأكيداً نهائياً للحجز ما لم يسدد كامل المبلغ.</li>
                <li>العربون المدفوع <span className="text-rose-600 font-bold">غير مسترد</span> في حال إلغاء الحجز من قبل الضيف.</li>
                <li>يجب دفع باقي قيمة الحجز كاملاً قبل أو عند تسجيل الدخول للشاليه.</li>
                <li>يتم تحصيل مبلغ تأمين إضافي عند الدخول ويسترد عند الخروج بعد التأكد من سلامة الممتلكات.</li>
              </ul>
            </div>
          </div>

          <div className="mt-auto px-12 pb-12 pt-6 border-t border-[#15317E]/10 bg-slate-50/50 rounded-b-xl mx-4 mb-4 flex justify-between items-center">
            <div className="flex flex-col text-right gap-1.5">
               <span className="text-[#15317E] font-black text-lg flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#D97706]" /> 
                  {venueData?.website || 'aqarcloud.com'}
               </span>
               <span className="text-slate-500 font-bold text-xs flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {venueData?.city || 'المملكة العربية السعودية'}
               </span>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
               <div className="text-left pl-2">
                  <span className="block text-xs font-black text-[#15317E]">امسح الرمز</span>
                  <span className="block text-[10px] font-bold text-slate-500">لزيارة موقعنا وتأكيد الحجز</span>
               </div>
               <div className="p-1 bg-[#15317E] rounded-lg">
                  <QrCode className="w-10 h-10 text-white" strokeWidth={1.5} />
               </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ReceiptPrintPreview;
