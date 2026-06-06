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
  const agentInitials = agent?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '؟';

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
                  <AvatarImage src={agent?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{agentInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-heading font-bold group-hover:text-primary transition-colors">{agent?.full_name || 'وسيط'}</p>
                  {agent?.city && <p className="text-sm text-muted-foreground">{agent.city}</p>}
                </div>
              </Link>

              {agent?.phone && (
                <a href={`tel:${agent.phone}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    اتصال
                  </Button>
                </a>
              )}
              {agent?.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2 mt-2 bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="w-4 h-4" />
                    واتساب
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}