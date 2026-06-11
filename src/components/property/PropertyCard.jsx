import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Building2,
  Home,
  Ruler,
  Compass,
  Layers,
  Sofa,
  CalendarClock,
  FileText,
  CheckCircle2,
  MapPinned,
  Car,
  Waves,
  Trees,
  Utensils,
  Wind,
  DoorOpen,
  ShieldCheck,
  Wifi,
  Plug,
  Snowflake,
} from "lucide-react";
import { motion } from 'framer-motion';

const AIRBNB = '#FF385C';

const toEn = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));

const formatPrice = (price) => {
  if (!price) return '—';
  return toEn(price) + ' ر.س';
};


const getFeatureIcon = (feature = '') => {
  if (feature.includes('موقف') || feature.includes('سيارة')) return Car;
  if (feature.includes('مسبح')) return Waves;
  if (feature.includes('حديقة') || feature.includes('أشجار') || feature.includes('نخيل') || feature.includes('حوش')) return Trees;
  if (feature.includes('مطبخ') || feature.includes('مطعم')) return Utensils;
  if (feature.includes('تكييف') || feature.includes('تبريد')) return Wind;
  if (feature.includes('مدخل') || feature.includes('بوابة') || feature.includes('واجهة') || feature.includes('زجاج')) return DoorOpen;
  if (feature.includes('حارس') || feature.includes('أمن') || feature.includes('حراسة')) return ShieldCheck;
  if (feature.includes('انترنت')) return Wifi;
  if (feature.includes('كهرباء') || feature.includes('عداد')) return Plug;
  if (feature.includes('تبريد')) return Snowflake;
  return CheckCircle2;
};

const item = (Icon, label, value) => {
  if (value === undefined || value === null || value === '' || value === 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1.5 text-[11px] font-bold text-zinc-600">
      <Icon className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
      <span className="text-zinc-400">{label}</span>
      <span className="text-zinc-800">{value}</span>
    </span>
  );
};

export default function PropertyCard({ property, index = 0 }) {
  const mainImage = property.images?.[0];
  const location = [property.neighborhood, property.city].filter(Boolean).join('، ');
  const priceText = property.price_on_request
    ? 'السعر عند الطلب'
    : property.price_negotiable
    ? 'السعر قابل للتفاوض'
    : formatPrice(property.price);

  const specs = [
    item(Building2, 'النوع', property.type),
    item(Layers, 'العرض', property.listing_type),
    property.rental_period ? item(CalendarClock, 'الإيجار', property.rental_period) : null,
    property.area ? item(Maximize, 'المساحة', `${toEn(property.area)} م²`) : null,
    property.street_width ? item(Ruler, 'الشارع', `${toEn(property.street_width)} م`) : null,
    property.facade ? item(Compass, 'الواجهة', property.facade) : null,
    property.bedrooms ? item(BedDouble, 'غرف', property.bedrooms) : null,
    property.bathrooms ? item(Bath, 'دورات', property.bathrooms) : null,
    property.halls ? item(Sofa, 'صالات', property.halls) : null,
    property.property_age ? item(Home, 'العمر', `${toEn(property.property_age)} سنة`) : null,
    property.length_street ? item(Ruler, 'على الشارع', `${toEn(property.length_street)} م`) : null,
    property.length_depth ? item(Ruler, 'العمق', `${toEn(property.length_depth)} م`) : null,
    property.plot_number ? item(FileText, 'المخطط', property.plot_number) : null,
    property.parcel_number ? item(FileText, 'القطعة', property.parcel_number) : null,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        to={`/property/${property.id}`}
        className="group block bg-white rounded-[1.7rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/70 transition-all duration-500"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
              <Building2 className="w-14 h-14 text-zinc-300" />
            </div>
          )}

          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

          <div className="absolute top-3 right-3 flex gap-2 flex-wrap">
            {property.listing_type && (
              <span className="rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-zinc-950 shadow-sm">
                {property.listing_type}
              </span>
            )}
            {property.type && (
              <span className="rounded-full bg-zinc-950/85 backdrop-blur px-3 py-1.5 text-[11px] font-black text-white shadow-sm">
                {property.type}
              </span>
            )}
          </div>

          {property.status && property.status !== 'نشط' && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-950">{property.status}</span>
            </div>
          )}

          <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between gap-3">
            <p className="inline-flex rounded-2xl bg-white px-3 py-2 text-sm font-black shadow-sm" style={{ color: AIRBNB }}>
              {priceText}
            </p>

            <div className="flex flex-col items-end gap-1.5">
              {property.facade && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-zinc-800 shadow-sm border border-white/70">
                  <Compass className="w-3.5 h-3.5" style={{ color: AIRBNB }} />
                  واجهة {property.facade}
                </span>
              )}

              {property.area && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur px-3 py-1.5 text-[11px] font-black text-white">
                  <Maximize className="w-3.5 h-3.5" />
                  {toEn(property.area)} م²
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-black text-zinc-950 text-base leading-snug line-clamp-2 group-hover:text-[#FF385C] transition-colors">
              {property.title || 'عقار بدون عنوان'}
            </h3>

            {location && (
              <div className="mt-2 flex items-center gap-1.5 text-zinc-500 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>

          {property.description && (
            <p className="text-xs font-medium text-zinc-500 leading-6 line-clamp-2">
              {property.description}
            </p>
          )}

          {specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100">
              {specs.slice(0, 10)}
            </div>
          )}

          {property.features?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {property.features.slice(0, 5).map((feature) => {
                const FeatureIcon = getFeatureIcon(feature);
                return (
                  <span key={feature} className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-500">
                    <FeatureIcon className="w-3 h-3" style={{ color: AIRBNB }} />
                    {feature}
                  </span>
                );
              })}
              {property.features.length > 5 && (
                <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-[11px] font-bold text-zinc-500">
                  +{toEn(property.features.length - 5)}
                </span>
              )}
            </div>
          )}

          {property.nearby_places?.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 pt-2">
              <MapPinned className="w-3.5 h-3.5" />
              {toEn(property.nearby_places.length)} موقع قريب مضاف
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
