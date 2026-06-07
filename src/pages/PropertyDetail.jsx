import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight, MapPin, BedDouble, Bath, Maximize, Building2,
  Phone, MessageCircle, Share2, ChevronLeft, ChevronRight as ChevronRightIcon, Loader2, Check, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import NearbyPlacesList from '@/components/property/NearbyPlacesList';
import { toast } from 'sonner';

// ── أيقونات التواصل ──
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const formatPrice = (price) => {
  if (!price) return '—';
  return new Intl.NumberFormat('ar-SA').format(price) + ' ر.س';
};

export default function PropertyDetail() {
  const navigate = useNavigate();
  const propertyId = window.location.pathname.split('/').pop();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const items = await base44.entities.Property.filter({ id: propertyId });
      return items[0];
    },
  });

  const { data: agent } = useQuery({
    queryKey: ['agent', property?.created_by_id],
    queryFn: async () => {
      const users = await base44.entities.User.filter({ id: property.created_by_id });
      return users[0];
    },
    enabled: !!property?.created_by_id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">العقار غير موجود</p>
        <Button variant="link" onClick={() => navigate(-1)}>العودة</Button>
      </div>
    );
  }

  const images = property.images || [];
  const agentInitials = (agent?.office_name || agent?.full_name)?.split(' ').map(n => n[0]).join('').slice(0, 2) || '؟';

  const shareProperty = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ الرابط');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
        <ArrowRight className="w-4 h-4" />
        العودة
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10]">
            {images.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={images[currentImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-16 h-16 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <Badge className="bg-primary text-primary-foreground">{property.listing_type}</Badge>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
                <h1 className="text-2xl font-heading font-bold">{property.title}</h1>
                {(property.city || property.neighborhood) && (
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-2">
                    <MapPin className="w-4 h-4" />
                    {[property.neighborhood, property.city].filter(Boolean).join('، ')}
                  </p>
                )}
              </div>
              <Button variant="outline" size="icon" onClick={shareProperty}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-3xl font-heading font-bold text-primary mt-4">
              {formatPrice(property.price)}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {property.area > 0 && (
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Maximize className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">المساحة</p>
                  <p className="font-bold">{property.area} م²</p>
                </CardContent>
              </Card>
            )}
            {property.bedrooms > 0 && (
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <BedDouble className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">غرف النوم</p>
                  <p className="font-bold">{property.bedrooms}</p>
                </CardContent>
              </Card>
            )}
            {property.bathrooms > 0 && (
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Bath className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">دورات المياه</p>
                  <p className="font-bold">{property.bathrooms}</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Building2 className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">النوع</p>
                <p className="font-bold">{property.type}</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {property.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-bold mb-3">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {property.features?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-bold mb-3">المميزات</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nearby Places */}
          {property.nearby_places?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold">ما يحيط بالعقار</h3>
                  {property.maps_url && (
                    <a href={property.maps_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <ExternalLink className="w-3 h-3" />
                        الموقع على الخريطة
                      </Button>
                    </a>
                  )}
                </div>
                <NearbyPlacesList places={property.nearby_places} />
              </CardContent>
            </Card>
          )}

          {/* Maps link if no nearby places but maps_url exists */}
          {!property.nearby_places?.length && property.maps_url && (
            <a href={property.maps_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full gap-2">
                <MapPin className="w-4 h-4" />
                عرض الموقع على الخريطة
              </Button>
            </a>
          )}
        </div>

        {/* Sidebar - Agent */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <Link to={`/agent/${agent?.id}`} className="flex items-center gap-3 group">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={agent?.office_logo_url || agent?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{agentInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-heading font-bold text-base group-hover:text-primary transition-colors">{agent?.office_name || agent?.full_name || 'وسيط'}</p>
                  {agent?.city && <p className="text-sm text-muted-foreground">{agent.city}</p>}
                </div>
              </Link>

              {(agent?.whatsapp || agent?.phone) && (
                <div className="flex items-center gap-2.5 mt-3">
                  {agent?.whatsapp && (
                    <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#15317E] hover:bg-[#0d1e4c] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#15317E]/20 hover:-translate-y-0.5">
                      <WhatsAppIcon className="w-4 h-4" /> واتساب
                    </a>
                  )}
                  {agent?.phone && (
                    <a href={`tel:${agent.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#15317E] hover:bg-[#0d1e4c] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#15317E]/20 hover:-translate-y-0.5">
                      <PhoneIcon className="w-4 h-4" /> اتصال
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
