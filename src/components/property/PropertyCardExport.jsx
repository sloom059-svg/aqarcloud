import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Calendar, Maximize, Bath, BedDouble, Armchair, ChefHat, Sun, Diamond, Home, Crosshair, QrCode, Phone, MessageCircle } from 'lucide-react';
// Note: Assuming you have lucide-react installed for icons. 
// If you prefer font-awesome as in the original HTML, you'll need to load it in your project.

export default function PropertyCardExport({ propertyData }) {
    const cardRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportedImage, setExportedImage] = useState(null);

    // Default placeholder data if some props are missing
    const data = {
        title: propertyData?.title || 'فيلا فاخرة للإيجار',
        location: propertyData?.location || 'الرياض - حي النرجس',
        refId: propertyData?.refId || 'A-2024-1258',
        price: propertyData?.price || '120,000',
        area: propertyData?.area || '450',
        age: propertyData?.age || '3 سنوات',
        rooms: propertyData?.rooms || '5',
        baths: propertyData?.baths || '6',
        halls: propertyData?.halls || '2',
        kitchens: propertyData?.kitchens || '1',
        type: propertyData?.type || 'فيلا',
        status: propertyData?.status || 'متاح',
        license: propertyData?.license || '7200123456',
        phone: propertyData?.phone || '050 123 4567',
        social: propertyData?.social || 'mthaal.realestate',
        // Placeholders for images
        mainImage: propertyData?.mainImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        subImage1: propertyData?.subImage1 || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        subImage2: propertyData?.subImage2 || 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    };

    const handleExport = async () => {
        if (!cardRef.current) return;
        
        setIsExporting(true);
        
        try {
            // استدعاء مكتبة html2canvas بشكل ديناميكي لتفادي أي مشاكل في البناء (Build) على Vercel
            if (!window.html2canvas) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            
            const canvas = await window.html2canvas(cardRef.current, {
                scale: 2, // جودة عالية
                useCORS: true, // ضروري لدعم الصور الخارجية
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    // التأكد من عدم وجود تمدد في الحجم أثناء النسخ
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
            
            <div className="w-full flex justify-end mb-4">
                 <Button 
                    onClick={handleExport} 
                    disabled={isExporting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
                >
                    {isExporting ? 'جاري الإنشاء...' : 'حفظ كصورة (تصدير البطاقة)'}
                </Button>
            </div>

            {/* The wrapper that will be exported */}
            <div className="bg-gray-200 p-8 rounded-xl w-full flex justify-center overflow-x-auto">
                <div 
                    ref={cardRef}
                    id="card-to-export"
                    // Fixed width is crucial for consistent image generation without text overlap
                    className="bg-white w-[800px] min-w-[800px] rounded-2xl shadow-xl overflow-hidden pb-8 relative"
                    dir="rtl"
                >
                    {}
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        {/* Agency Logo */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-1">
                                <Building className="w-6 h-6 text-gray-800" />
                            </div>
                            <span className="text-sm font-bold text-gray-800">مكتب المثال العقاري</span>
                            <span className="text-[10px] text-gray-500">خدمات عقارية متكاملة</span>
                        </div>
                        
                        {/* Title & Location */}
                        <div className="text-center flex-grow">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 leading-tight">{data.title}</h1>
                            <div className="flex items-center justify-center text-gray-600 gap-2">
                                <span className="text-lg">{data.location}</span>
                                <MapPin className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Platform Logo */}
                        <div className="flex flex-col items-center gap-1 text-red-500 font-bold text-lg">
                            {/* Placeholder for airbnb logo or similar */}
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">منصة العرض</span>
                        </div>
                    </div>

                    {}
                    <div className="relative p-6">
                        {/* Floating Badges */}
                        <div className="absolute top-10 right-10 z-10 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg border border-gray-100 text-center w-32">
                            <div className="text-xs text-gray-500 mb-1">رقم العرض</div>
                            <div className="font-bold text-gray-800 break-words">{data.refId}</div>
                        </div>

                        <div className="absolute bottom-10 right-10 z-10 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-100 text-center w-40">
                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2 border-b pb-2">
                                <span className="text-sm">السعر المعروض</span>
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-blue-900 mb-1 leading-none">{data.price}</div>
                            <div className="text-sm text-gray-600">ريال سعودي</div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-3 gap-4 h-[400px]">
                            {/* Main Large Image */}
                            <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-sm relative">
                                {/* Using img tags with crossOrigin="anonymous" is crucial if loading from external domains */}
                                <img src={data.mainImage} alt="Main Property" crossOrigin="anonymous" className="w-full h-full object-cover" />
                            </div>
                            {/* Side Images */}
                            <div className="rounded-xl overflow-hidden shadow-sm relative">
                                <img src={data.subImage1} alt="Interior 1" crossOrigin="anonymous" className="w-full h-full object-cover" />
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-sm relative">
                                <img src={data.subImage2} alt="Interior 2" crossOrigin="anonymous" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="px-8 mt-4">
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-200 flex-grow"></div>
                            <span className="px-4 text-gray-600 font-bold text-lg bg-white">مواصفات العقار</span>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>

                        <div className="grid grid-cols-6 gap-4 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-2 text-gray-600"><Maximize className="w-5 h-5"/></div>
                                <span className="text-xs text-gray-500 mb-1">المساحة</span>
                                <span className="font-bold text-sm text-gray-800">{data.area} م²</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-2 text-gray-600"><Calendar className="w-5 h-5"/></div>
                                <span className="text-xs text-gray-500 mb-1">عمر العقار</span>
                                <span className="font-bold text-sm text-gray-800">{data.age}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-2 text-gray-600"><BedDouble className="w-5 h-5"/></div>
                                <span className="text-xs text-gray-500 mb-1">عدد الغرف</span>
                                <span className="font-bold text-sm text-gray-800">{data.rooms}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-2 text-gray-600"><Bath className="w-5 h-5"/></div>
                                <span className="text-xs text-gray-500 mb-1">دورات المياه</span>
                                <span className="font-bold text-sm text-gray-800">{data.baths}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-2 text-gray-600"><Armchair className="w-5 h-5"/></div>
                                <span className="text-xs text-gray-500 mb-1">الصالات</span>
                                <span className="font-bold text-sm text-gray-800">{data.halls}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-2 text-gray-600"><ChefHat className="w-5 h-5"/></div>
                                <span className="text-xs text-gray-500 mb-1">المطبخ</span>
                                <span className="font-bold text-sm text-gray-800">{data.kitchens}</span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="px-8 mt-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-200 flex-grow"></div>
                            <span className="px-4 text-gray-600 font-bold text-lg bg-white">مميزات العقار</span>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>

                        <div className="flex justify-around text-center px-10">
                            <div className="flex flex-col items-center">
                                <Sun className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">إضاءة طبيعية</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Diamond className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">تشطيب فاخر</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Home className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">حي راقي وهادئ</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Crosshair className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">موقع مميز</span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="px-8 mt-10 grid grid-cols-3 gap-6">
                        {/* Additional Details Table */}
                        <div className="col-span-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-center font-bold text-gray-700 mb-3 border-b pb-2">تفاصيل إضافية</h4>
                            <table className="w-full text-sm text-right">
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-1 text-gray-500 whitespace-nowrap">نوع العقار</td>
                                        <td className="py-1 font-semibold text-gray-800 text-left">{data.type}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-1 text-gray-500 whitespace-nowrap">حالة العقار</td>
                                        <td className="py-1 font-semibold text-gray-800 text-left">{data.status}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 text-gray-500 whitespace-nowrap">رقم الإعلان</td>
                                        <td className="py-1 font-semibold text-gray-800 text-left text-xs">{data.license}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* QR Code Placeholder */}
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-2">
                                <QrCode className="w-10 h-10 text-gray-400" />
                            </div>
                            <span className="text-[10px] text-gray-500">امسح الكود للوصول للموقع</span>
                        </div>

                        {/* Contact Info */}
                        <div className="col-span-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                            <h4 className="text-center font-bold text-gray-700 mb-3 border-b pb-2">للتواصل والاستفسار</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3" dir="ltr">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="font-semibold text-gray-800 flex-grow text-right truncate">{data.phone}</span>
                                </div>
                                <div className="flex items-center gap-3" dir="ltr">
                                    <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="font-semibold text-gray-800 flex-grow text-right truncate">{data.phone}</span>
                                </div>
                                <div className="flex items-center gap-3" dir="ltr">
                                    <span className="text-yellow-400 w-4 font-bold text-center flex-shrink-0">@</span>
                                    <span className="font-semibold text-gray-800 flex-grow text-right truncate">{data.social}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            {exportedImage && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-xl font-bold">تم إنشاء الصورة بنجاح!</h3>
                            <button 
                                onClick={() => setExportedImage(null)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition font-bold"
                            >
                                إغلاق
                            </button>
                        </div>
                        
                        <div className="flex-grow overflow-auto border rounded-lg bg-gray-100 flex items-center justify-center p-4">
                            <img src={exportedImage} alt="Exported Property Card" className="shadow-lg rounded max-w-full h-auto" />
                        </div>
                        
                        <div className="mt-6 flex justify-center gap-4">
                            <a 
                                href={exportedImage} 
                                download={`property_${data.refId}.png`} 
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded shadow transition flex items-center gap-2"
                            >
                                تحميل الصورة
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
