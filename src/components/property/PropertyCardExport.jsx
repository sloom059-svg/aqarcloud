import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Calendar, Maximize, Bath, BedDouble, Armchair, ChefHat, Sun, Diamond, Home, Crosshair, QrCode, Phone, MessageCircle, CheckCircle2, Car, Trees, ShieldCheck, Download, Compass, Ruler, Signpost } from 'lucide-react';

export default function PropertyCardExport({ property, agent, onClose }) {
    const cardRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportedImage, setExportedImage] = useState(null);

    // تجهيز البيانات الأساسية
    const data = {
        title: property?.title || 'عنوان العقار',
        location: [property?.city, property?.district].filter(Boolean).join(' - ') || property?.location || property?.address || 'الموقع',
        refId: property?.id ? String(property.id).substring(0, 8).toUpperCase() : 'غير متوفر',
        price: property?.price ? Number(property.price).toLocaleString() : 'على السوم',
        type: property?.type || property?.property_type || 'عقار',
        status: property?.purpose === 'rent' ? 'للإيجار' : (property?.purpose === 'sale' ? 'للبيع' : 'متاح'),
        license: property?.license_number || agent?.license_number || 'غير متوفر',
        phone: agent?.phone || 'غير متوفر',
        social: agent?.username || agent?.office_name || 'غير متوفر',
        agencyName: agent?.office_name || 'مكتب عقاري',
        agencyLogo: agent?.office_logo_url || agent?.profile_image_url || null,
        
        // جلب الصور الفعلية فقط (وإذا لم يوجد أي صورة، نضع صورة واحدة افتراضية)
        propertyImages: property?.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        
        features: property?.features || property?.amenities || []
    };

    // تجهيز المواصفات الديناميكية بناءً على نوع العقار
    const isLand = data.type.includes('أرض') || data.type.includes('ارض');
    
    // مواصفات عامة وسكنية
    const specs = {
        area: property?.area || property?.space || '-',
        age: property?.age || property?.property_age || '-',
        rooms: property?.bedrooms || property?.rooms || '-',
        baths: property?.bathrooms || property?.baths || '-',
        halls: property?.living_rooms || property?.halls || '-',
        kitchens: property?.kitchens || '-',
        // مواصفات الأراضي والتجاري
        streetWidth: property?.street_width || '-',
        depth: property?.depth || property?.length || '-',
        facade: property?.facade || property?.direction || '-'
    };

    const getFeatureIcon = (featureName) => {
        if (!featureName) return <CheckCircle2 className="w-6 h-6 text-gray-400 mb-2" />;
        const name = featureName.toLowerCase();
        if (name.includes('إضاءة') || name.includes('شمس')) return <Sun className="w-6 h-6 text-gray-400 mb-2" />;
        if (name.includes('تشطيب') || name.includes('فاخر')) return <Diamond className="w-6 h-6 text-gray-400 mb-2" />;
        if (name.includes('حي') || name.includes('هادئ')) return <Home className="w-6 h-6 text-gray-400 mb-2" />;
        if (name.includes('موقع') || name.includes('مميز')) return <Crosshair className="w-6 h-6 text-gray-400 mb-2" />;
        if (name.includes('سيار') || name.includes('كراج')) return <Car className="w-6 h-6 text-gray-400 mb-2" />;
        if (name.includes('حديق') || name.includes('حوش') || name.includes('شجر')) return <Trees className="w-6 h-6 text-gray-400 mb-2" />;
        if (name.includes('حراس') || name.includes('أمن')) return <ShieldCheck className="w-6 h-6 text-gray-400 mb-2" />;
        return <CheckCircle2 className="w-6 h-6 text-gray-400 mb-2" />;
    };

    // دالة مساعدة لعرض الصورة بدون تمغيط (مع خلفية ضبابية أنيقة تملأ الفراغ)
    const renderImageBlock = (src, className = "") => (
        <div className={`rounded-xl overflow-hidden shadow-sm relative bg-gray-900 border border-gray-100 ${className}`}>
            {/* خلفية ضبابية تملأ الفراغ */}
            <img src={src} crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-xl scale-110" alt="blur" />
            {/* الصورة الفعلية مع object-contain لعدم التمغيط */}
            <img src={src} crossOrigin="anonymous" className="relative z-10 w-full h-full object-contain" alt="Property" />
        </div>
    );

    const handleExport = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            if (!window.html2canvas) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                    script.crossOrigin = 'anonymous';
                    script.onload = () => resolve(window.html2canvas);
                    script.onerror = () => reject(new Error('Failed to load html2canvas'));
                    document.head.appendChild(script);
                });
            }
            
            const canvas = await window.html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    const element = clonedDoc.getElementById('card-to-export');
                    if (element) {
                        element.style.transform = 'scale(1)';
                    }
                }
            });
            
            const dataUrl = canvas.toDataURL('image/png');
            setExportedImage(dataUrl);
        } catch (error) {
            console.error('Error exporting image:', error);
            alert('حدث خطأ أثناء إنشاء الصورة. يرجى التأكد من أن الصور المستخدمة تدعم CORS.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto font-[Cairo]">
            
            {/* The wrapper that will be exported (Hidden from view while configuring) */}
            <div className="w-full overflow-x-auto rounded-xl">
                <div 
                    ref={cardRef}
                    id="card-to-export"
                    className="bg-white w-[800px] min-w-[800px] rounded-2xl shadow-xl overflow-hidden pb-8 relative mx-auto"
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        <div className="flex flex-col items-center max-w-[160px] min-w-[120px]">
                            <div className="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center mb-2 overflow-hidden bg-white shadow-sm">
                                {data.agencyLogo ? (
                                    <img src={data.agencyLogo} alt="Agency Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
                                ) : (
                                    <Building className="w-7 h-7 text-gray-800" />
                                )}
                            </div>
                            <span className="text-[15px] font-bold text-gray-800 text-center pb-1">{data.agencyName}</span>
                            <span className="text-[11px] text-gray-500">خدمات عقارية متكاملة</span>
                        </div>
                        
                        <div className="text-center flex-grow px-4">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 pb-2 leading-tight">{data.title}</h1>
                            <div className="flex items-center justify-center text-gray-500 gap-2">
                                <span className="text-lg font-medium">{data.location}</span>
                                <MapPin className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="max-w-[160px] min-w-[120px]"></div>
                    </div>

                    {/* Images Section */}
                    <div className="relative p-6">
                        <div className="absolute top-10 right-10 z-10 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg border border-gray-100 text-center w-36">
                            <div className="text-xs text-gray-500 mb-1 font-medium">رقم العرض</div>
                            <div className="font-bold text-gray-800 break-words text-lg pb-1">{data.refId}</div>
                        </div>

                        <div className="absolute bottom-10 right-10 z-10 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-100 text-center w-44">
                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-2 border-b pb-2">
                                <span className="text-sm font-medium">السعر المعروض</span>
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-blue-900 mb-1 pb-1">{data.price}</div>
                            {property?.price && <div className="text-sm text-gray-500 font-medium">ريال سعودي</div>}
                        </div>

                        {/* شبكة الصور الديناميكية بناءً على عدد الصور */}
                        <div className="h-[400px]">
                            {data.propertyImages.length === 1 && (
                                <div className="w-full h-full">
                                    {renderImageBlock(data.propertyImages[0], "w-full h-full")}
                                </div>
                            )}
                            {data.propertyImages.length === 2 && (
                                <div className="grid grid-cols-2 gap-4 h-full">
                                    {renderImageBlock(data.propertyImages[0], "w-full h-full")}
                                    {renderImageBlock(data.propertyImages[1], "w-full h-full")}
                                </div>
                            )}
                            {data.propertyImages.length >= 3 && (
                                <div className="grid grid-cols-3 gap-4 h-full">
                                    {renderImageBlock(data.propertyImages[0], "col-span-2 row-span-2 w-full h-full")}
                                    {renderImageBlock(data.propertyImages[1], "w-full h-full")}
                                    {renderImageBlock(data.propertyImages[2], "w-full h-full")}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specs Section (Dynamic based on property type) */}
                    <div className="px-8 mt-4">
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-200 flex-grow"></div>
                            <span className="px-4 text-gray-500 font-bold text-lg bg-white">مواصفات العقار</span>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>

                        <div className={`grid gap-4 text-center ${isLand ? 'grid-cols-4 px-12' : 'grid-cols-6'}`}>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><Maximize className="w-6 h-6"/></div>
                                <span className="text-xs text-gray-500 mb-1 font-medium">المساحة</span>
                                <span className="font-bold text-sm text-gray-800">{specs.area} {specs.area !== '-' && 'م²'}</span>
                            </div>
                            
                            {isLand ? (
                                <>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><Compass className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">الواجهة</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.facade}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><Signpost className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">عرض الشارع</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.streetWidth} {specs.streetWidth !== '-' && 'م'}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><Ruler className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">العمق</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.depth} {specs.depth !== '-' && 'م'}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><Calendar className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">عمر العقار</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.age}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><BedDouble className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">عدد الغرف</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.rooms}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><Bath className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">دورات المياه</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.baths}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><Armchair className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">الصالات</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.halls}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl mb-2 text-gray-500 bg-gray-50"><ChefHat className="w-6 h-6"/></div>
                                        <span className="text-xs text-gray-500 mb-1 font-medium">المطبخ</span>
                                        <span className="font-bold text-sm text-gray-800">{specs.kitchens}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features Section */}
                    {data.features && data.features.length > 0 && (
                        <div className="px-8 mt-8">
                            <div className="flex items-center justify-center mb-6">
                                <div className="h-px bg-gray-200 flex-grow"></div>
                                <span className="px-4 text-gray-500 font-bold text-lg bg-white">مميزات العقار</span>
                                <div className="h-px bg-gray-200 flex-grow"></div>
                            </div>

                            <div className="flex justify-around text-center px-10 flex-wrap gap-y-4">
                                {data.features.slice(0, 4).map((feature, index) => {
                                    const featureName = typeof feature === 'string' ? feature : feature?.name;
                                    return (
                                        <div key={index} className="flex flex-col items-center min-w-[100px]">
                                            {getFeatureIcon(featureName)}
                                            <span className="text-sm text-gray-600 font-medium">{featureName}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Footer Section */}
                    <div className="px-8 mt-10 grid grid-cols-3 gap-6">
                        <div className="col-span-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-center font-bold text-gray-600 mb-3 border-b pb-2">تفاصيل إضافية</h4>
                            <table className="w-full text-sm text-right">
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-2 text-gray-500 whitespace-nowrap font-medium">نوع العقار</td>
                                        <td className="py-2 font-bold text-gray-800 text-left">{data.type}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-2 text-gray-500 whitespace-nowrap font-medium">النوع</td>
                                        <td className="py-2 font-bold text-gray-800 text-left">{data.status}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500 whitespace-nowrap font-medium">رقم الترخيص</td>
                                        <td className="py-2 font-bold text-gray-800 text-left text-xs">{data.license}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl mb-3">
                                <QrCode className="w-10 h-10 text-gray-400" />
                            </div>
                            <span className="text-[11px] text-gray-500 font-medium">امسح الكود للوصول للموقع</span>
                        </div>

                        <div className="col-span-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center items-center text-center">
                            <h4 className="font-bold text-gray-600 mb-4 border-b pb-2 w-full">للتواصل والاستفسار</h4>
                            
                            {/* Contact Info (Modified to be side-by-side icons and large text) */}
                            <div className="flex flex-col items-center gap-3 w-full">
                                <div className="flex items-center justify-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-full">
                                    <div className="flex gap-2 text-green-500 bg-green-50 p-1.5 rounded-lg">
                                        <Phone className="w-5 h-5" />
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg tracking-wider" dir="ltr">{data.phone}</span>
                                </div>
                                
                                {data.social && data.social !== 'غير متوفر' && (
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="text-yellow-500 font-black">@</span>
                                        <span className="font-bold text-gray-600">{data.social}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Modal (The actual modal seen by user after processing) */}
            {!exportedImage ? (
                <div className="flex flex-col items-center w-full mt-4">
                    <Button 
                        onClick={handleExport} 
                        disabled={isExporting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition duration-300 flex items-center gap-3 text-lg w-full max-w-sm"
                    >
                        {isExporting ? 'جاري تجهيز الصورة...' : 'معاينة وتصدير البطاقة'}
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 font-bold mt-2"
                    >
                        إلغاء
                    </Button>
                </div>
            ) : (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="bg-white p-4 sm:p-6 rounded-[2rem] w-full max-w-lg flex flex-col shadow-2xl">
                        
                        <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0 px-2">
                            <h3 className="text-xl font-black text-gray-800">الصورة جاهزة!</h3>
                            <button 
                                onClick={() => setExportedImage(null)}
                                className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-full transition font-bold"
                            >
                                إغلاق
                            </button>
                        </div>
                        
                        {/* Smaller thumbnail preview container */}
                        <div className="flex-grow w-full max-h-[50vh] sm:max-h-[60vh] overflow-hidden border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex items-center justify-center p-2 sm:p-4 relative">
                            <img 
                                src={exportedImage} 
                                alt="Exported Property Card" 
                                className="shadow-md rounded-xl w-auto h-full max-w-full object-contain" 
                            />
                        </div>
                        
                        <div className="mt-4 sm:mt-6 flex justify-center flex-shrink-0">
                            <a 
                                href={exportedImage} 
                                download={`property_${data.refId}.png`} 
                                className="bg-zinc-900 w-full justify-center hover:bg-black text-white font-black py-4 px-8 rounded-2xl shadow-xl transition flex items-center gap-3 text-lg"
                            >
                                <Download className="w-6 h-6"/>
                                تحميل الصورة لجهازك
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
