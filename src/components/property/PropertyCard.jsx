import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Bath, Maximize, Building2 } from "lucide-react";
import { motion } from 'framer-motion';

const formatPrice = (price) => {
  if (!price) return '—';
  return new Intl.NumberFormat('ar-SA').format(price) + ' ر.س';
};

export default function PropertyCard({ property, index = 0 }) {
  const mainImage = property.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/property/${property.id}`}
        className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">
              {property.listing_type}
            </Badge>
          </div>
          {property.status && property.status !== 'نشط' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-1">{property.status}</Badge>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <p className="text-primary font-bold text-lg">{formatPrice(property.price)}</p>
            <h3 className="font-heading font-semibold text-foreground mt-1 line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>

          {(property.city || property.neighborhood) && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">
                {[property.neighborhood, property.city].filter(Boolean).join('، ')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 text-muted-foreground text-xs pt-2 border-t border-border">
            {property.type && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {property.type}
              </span>
            )}
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />
                {property.bathrooms}
              </span>
            )}
            {property.area > 0 && (
              <span className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" />
                {property.area} م²
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}