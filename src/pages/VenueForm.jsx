import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { Loader2, Check, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import WizardSteps from '@/components/venue/wizard/WizardSteps';
import SuccessScreen from '@/components/venue/wizard/SuccessScreen';
import { REGIONS_DATA } from '@/components/venue/wizard/wizardData';

const TOTAL_STEPS = 10;
// خطوات تتقدّم تلقائياً (إخفاء زر متابعة): اختيار النوع
const AUTO_STEPS = [1];

export default function VenueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');

  const [form, setForm] = useState({
    name: '', venue_type: '', description: '', city: '',
    maps_url: '', images: [], video_url: '',
    youtube_urls: [],
    custom_features: [],
    social: { instagram: '', snapchat: '', tiktok: '', x: '' },
    page_theme: 'classic',
    price_weekday: '', price_weekend: '',
    whatsapp: '', check_in_time: '14:00', check_out_time: '12:00',
    booking_terms: '', features: [], status: 'نشط', slug: '',
    theme_color: '#c9a96e',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVenue, setSuccessVenue] = useState(null);

  const { data: existing } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => base44.entities.Venue.filter({ id }),
    enabled: isEdit,
    select: (d) => d[0],
  });

  useEffect(() => {
    if (existing) {
      setForm(prev => ({
        ...prev,
        ...existing,
        custom_features: existing.custom_features || [],
        youtube_urls: existing.youtube_urls || [],
        page_theme: existing.page_theme || 'classic',
        theme_color: existing.theme_color || '#c9a96e',
        social: { instagram: '', snapchat: '', tiktok: '', x: '', ...(existing.social || {}) },
      }));
      // حدد المنطقة تلقائياً من المدينة المحفوظة
      if (existing.city) {
        const region = Object.keys(REGIONS_DATA).find(r => REGIONS_DATA[r].includes(existing.city));
        if (region) setSelectedRegion(region);
      }
    }
  }, [existing]);

  useEffect(() => {
    if (user?.business_type && !form.venue_type) {
      setForm(prev => ({ ...prev, venue_type: user.business_type }));
    }
  }, [user]);

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [...form.images];
    for (const file of files.slice(0, 10 - urls.length)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm(prev => ({ ...prev, images: urls }));
    setUploading(false);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSaving(true);
    const cleanSocial = {};
    Object.entries(form.social || {}).forEach(([k, v]) => { if (v && v.trim()) cleanSocial[k] = v.trim(); });

    const data = {
      ...form,
      price_weekday: form.price_weekday ? Number(form.price_weekday) : undefined,
      price_weekend: form.price_weekend ? Number(form.price_weekend) : undefined,
      owner_id: user?.id,
      slug: form.slug || `venue-${Date.now()}`,
      custom_features: (form.custom_features || []).filter(cf => cf.label && cf.label.trim()),
      social: cleanSocial,
    };

    try {
      if (isEdit) {
        await base44.entities.Venue.update(id, data);
        await queryClient.invalidateQueries({ queryKey: ['venues'] });
        await queryClient.invalidateQueries({ queryKey: ['venue', id] });
        toast.success('تم تحديث الشاليه بنجاح');
        navigate('/venue');
      } else {
        const created = await base44.entities.Venue.create(data);
        await queryClient.invalidateQueries({ queryKey: ['venues'] });
        const slug = created?.slug || data.slug;
        setSuccessVenue({ name: form.name, url: `${window.location.origin}/place/${slug}`, type: user?.business_type || 'الشاليه' });
      }
    } catch (err) {
      toast.error('حدث خطأ: ' + (err?.message || 'تعذّر الحفظ'));
    } finally {
      setSaving(false);
    }
  };

  if (successVenue) return <SuccessScreen successVenue={successVenue} />;

  const progress = (step / TOTAL_STEPS) * 100;
  const isAutoStep = AUTO_STEPS.includes(step);
  const isLast = step === TOTAL_STEPS;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb] font-sans flex flex-col items-center justify-start py-8 px-4"
      style={{ backgroundImage: 'radial-gradient(at 0% 0%, hsla(225,39%,30%,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(40,45%,61%,0.05) 0px, transparent 50%)', backgroundAttachment: 'fixed' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}} />

      <div className="w-full max-w-xl mx-auto">
        {/* الهيدر وشريط التقدم */}
        <div className="mb-6 px-2 flex justify-between items-center">
          <button onClick={prevStep} disabled={step === 1}
            className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-[#15317E] transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex-1 px-6">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#15317E] transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button onClick={() => navigate('/venue')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(21,49,126,0.08)] p-6 md:p-10 min-h-[450px] flex flex-col">
          <div className="flex-1">
            <WizardSteps
              step={step}
              form={form}
              setForm={setForm}
              uploading={uploading}
              handleImgUpload={handleImgUpload}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              onAutoAdvance={nextStep}
            />
          </div>

          {/* أزرار التنقل */}
          <div className="mt-8 pt-4 flex justify-end items-center">
            {isLast ? (
              <button onClick={handleSubmit} disabled={saving}
                className="px-8 py-3.5 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</> : <>{isEdit ? 'حفظ التعديلات' : 'احفظ وانشر'} <Check className="w-4 h-4" /></>}
              </button>
            ) : !isAutoStep ? (
              <button onClick={nextStep}
                className="px-8 py-3.5 rounded-full font-bold text-white bg-[#15317E] hover:bg-[#0d1e4c] shadow-lg shadow-[#15317E]/30 transition-all flex items-center gap-2 active:scale-95">
                متابعة <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
