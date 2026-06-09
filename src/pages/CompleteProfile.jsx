import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2, Building2, Phone, Upload, Hotel, Tent, Leaf, Trees,
  Home, MapPin, ArrowRight, PartyPopper, Share2, Eye, Rocket, ChevronRight,
  X, Plus, Trash2, Check, Sun, Crown, Star, ShieldCheck, Waves, Wifi,
  UtensilsCrossed, Tv, Dumbbell, Bath, Wind, Instagram, ChevronDown,
  CheckCircle2, Coins, Users, Copy
} from "lucide-react";
import CityCombobox from "@/components/venue/CityCombobox";

// ── ثوابت ── (لم تتغير)
const CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","تبوك","بريدة","حائل","أبها","خميس مشيط","جازان","نجران","ينبع","الجبيل","الأحساء","القطيف","الرس","عنيزة","الزلفي","المجمعة","شقراء","الدوادمي","الأفلاج","وادي الدواسر","سكاكا","القريات","عرعر","رفحاء","طريف","الوجه","أملج","ضباء","البدع","بيشة","محايل عسير","صبيا","أبو عريش","صامطة","الليث","رابغ","القنفذة","الباحة","بلجرشي","المندق","مدينة الملك عبدالله الاقتصادية"];

const ROLES = [
  { id: 'وسيط',    label: 'وسيط عقاري',   Icon: Building2, desc: 'إدارة وعرض العقارات للبيع والإيجار' },
  { id: 'شاليه',   label: 'مالك شاليه',    Icon: Hotel,     desc: 'إدارة الشاليه وحجوزاته' },
  { id: 'مخيم',    label: 'مالك مخيم',     Icon: Tent,      desc: 'إدارة المخيم والحجوزات' },
  { id: 'مزرعة',   label: 'مالك مزرعة',    Icon: Leaf,      desc: 'إدارة المزرعة وخدماتها' },
  { id: 'استراحة', label: 'مالك استراحة',  Icon: Trees,     desc: 'إدارة الاستراحة وحجوزاتها' },
];
const VENUE_ROLES = ['شاليه','مخيم','مزرعة','استراحة'];

const ALL_FEATURES = ["مسبح","جلسات خارجية","واي فاي","ملعب","مطبخ","دخول ذاتي","ألعاب أطفال","شواء","قسم رجال","قسم نساء","غرف نوم","حديقة","مولد كهرباء","مكيف","مدفأة"];

const CUSTOM_ICON_OPTIONS = [
  { key: 'star', Icon: Star }, { key: 'shield', Icon: ShieldCheck },
  { key: 'waves', Icon: Waves }, { key: 'wifi', Icon: Wifi },
  { key: 'grill', Icon: UtensilsCrossed }, { key: 'tv', Icon: Tv },
  { key: 'gym', Icon: Dumbbell }, { key: 'bath', Icon: Bath },
  { key: 'ac', Icon: Wind }, { key: 'sun', Icon: Sun },
];

const MAX_YOUTUBE = 5;

const TikTokIcon = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.34-.02-.68-.02-1.02.13-1.6.82-3.08 1.94-4.21 1.52-1.52 3.8-2.26 5.86-1.92V14.3c-1.11-.27-2.31-.1-3.29.41-.85.45-1.46 1.25-1.63 2.21-.07.39-.07.79-.02 1.18.17 1.25 1.05 2.34 2.19 2.81 1.29.54 2.8.46 4.02-.2 1.19-.65 1.95-1.9 2.05-3.26.2-2.9.06-5.82.09-8.73z"/></svg>;
const XIcon = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;
const SnapchatIcon = (p) => <svg viewBox="0 0 448 512" fill="currentColor" {...p}><path d="M424.2 263.8c-2.4-10.6-20.2-13.1-34.4-11-20.2 2.9-46.7 9-61.1 5.9-9.1-2-12.7-10.1-10.6-20.9 2-10.2 10.1-26.6 15.8-37.5 44-84.3 13.3-145-38.3-177.3C268.4 6 226.5-.4 191 1.7c-47.5 2.8-82 17.5-104.9 51.5-17.7 26.2-22.1 63.3-10.1 94.6 7.6 19.8 23 48.2 24.3 64.9 1.1 13.7-8.1 20.3-19.1 23-14.7 3.6-43.2-3.1-61.9-5.5-13.7-1.7-27.1 2-30.7 13.1-4 12.3 8.9 25 15.5 29.8 17.3 12.5 40 24.1 64.1 36.8 6.5 3.5 12.1 12 11.2 21.6-1 10.5-6.8 19.3-15.1 24.8-14.6 9.8-33.1 15.1-49.8 18.2-15.6 2.9-32.9 2.5-44.5 11.2C-5.5 391-2.9 405.3 6 414.2c16 16.1 41 18.9 62.1 22.1 19.1 2.9 38.6 3.6 57 8.3 16 4.1 30.6 11 41.5 23.3 7 7.9 13.9 17.8 24.4 23.4 12 6.5 26.7 8.7 39.5 8.7 12.5 0 25.5-2 37.2-7.8 10.7-5.3 17.8-15.5 24.9-23.7 11-12.7 25.9-19.8 42-23.9 18.6-4.8 38.3-5.3 57.6-8.2 21.2-3.2 46.5-6.1 62.6-22.4 8.7-8.8 11.5-23.4 5.2-32.2z"/></svg>;

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'انستقرام', placeholder: '@yourname', Icon: Instagram },
  { key: 'snapchat',  label: 'سناب شات', placeholder: '@yourname',  Icon: SnapchatIcon },
  { key: 'tiktok',    label: 'تيك توك',  placeholder: '@yourname',  Icon: TikTokIcon },
  { key: 'x',         label: 'إكس',      placeholder: '@yourname',         Icon: XIcon },
];

const THEME_COLORS = [
  { name: 'ذهبي', value: '#c9a96e' }, { name: 'أخضر زمردي', value: '#0f3d36' },
  { name: 'كحلي', value: '#1e304a' }, { name: 'نبيتي', value: '#7c2d3a' },
  { name: 'بني فاخر', value: '#6b4f3a' }, { name: 'تركوازي', value: '#1d7874' },
  { name: 'بنفسجي', value: '#5b3a70' }, { name: 'أزرق ملكي', value: '#2c4a7c' },
  { name: 'رمادي فحمي', value: '#2f3640' }, { name: 'وردي هادئ', value: '#b56576' },
];

const TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 0; h < 24; h++) for (const m of [0,30]) {
    const val = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    const period = h < 12 ? 'ص' : 'م'; let h12 = h % 12; if (!h12) h12 = 12;
    out.push({ val, label: `${h12}:${String(m).padStart(2,'0')} ${period}` });
  }
  return out;
})();

// ── مكوّن أيقونة مخصصة ──
function CustomFeatureRow({ cf, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const ActiveIcon = CUSTOM_ICON_OPTIONS.find(o => o.key === cf.icon)?.Icon || Star;
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="flex items-center gap-2 mb-2">
      <button type="button" onClick={onRemove} className="text-rose-500 hover:text-rose-700 shrink-0"><Trash2 className="w-4 h-4" /></button>
      <Input value={cf.label} onChange={e => onUpdate({ label: e.target.value })} placeholder="مثال: إطلالة جبلية" className="flex-1 h-10 rounded-xl border-slate-200" />
      <div className="relative" ref={ref}>
        <button type="button" onClick={() => setOpen(o => !o)} className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:border-[#15317E]/50 transition shrink-0">
          <ActiveIcon className="w-4 h-4 text-slate-500" />
        </button>
        {open && (
          <div className="absolute right-0 top-12 z-50 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 grid grid-cols-5 gap-1.5 w-52">
            {CUSTOM_ICON_OPTIONS.map(({ key, Icon }) => (
              <button key={key} type="button" onClick={() => { onUpdate({ icon: key }); setOpen(false); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${cf.icon === key ? 'bg-[#15317E] text-white border-[#15317E]' : 'bg-slate-50 text-slate-500 border-transparent hover:border-[#15317E]/40'}`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── الستايل العام ──
function Style() {
  return <style dangerouslySetInnerHTML={{__html: `
    @import url('[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap)');
    body { font-family: 'I
