import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, MapPin, Award, Building2, Share2, Loader2 } from "lucide-react";
import PropertyCard from '@/components/property/PropertyCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function AgentProfile() {
  const agentId = window.location.pathname.split('/').pop();

  const { data: agent, isLoading: agentLoading } = useQuery({
    queryKey: ['agent-profile', agentId],
    queryFn: async () => {
      const users = await base44.entities.User.filter({ id: agentId });
      return users[0];
    },
    enabled: !!agentId,
  });

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['agent-properties', agentId],
    queryFn: () => base44.entities.Property.filter({ created_by_id: agentId, status: 'نشط' }, '-created_date'),
    enabled: !!agentId,
  });

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط البروفايل');
  };

  if (agentLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground text-lg">الوسيط غير موجود</p>
      </div>
    );
  }

  const initials = agent.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '؟';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-bl from-primary/10 via-transparent to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Simple navbar for public page */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="https://media.base44.com/images/public/6a218975cdf06fe8cd10f742/f78b1dcb2_58415331623144694421.png"
                alt="الشعار"
                className="h-9 object-contain"
              />
            </Link>
            <Button variant="outline" size="sm" onClick={shareProfile} className="gap-2">
              <Share2 className="w-4 h-4" />
              مشاركة
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
          >
            <Avatar className="h-28 w-28 ring-4 ring-background shadow-xl">
              <AvatarImage src={agent.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-right flex-1">
              <h1 className="text-3xl font-heading font-bold">{agent.full_name}</h1>
              {agent.office_name && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                  <img
                    src={agent.office_logo_url || "https://media.base44.com/images/public/6a218975cdf06fe8cd10f742/ddc101a72_5841533162314469442.png"}
                    alt="شعار المكتب"
                    className="h-7 w-7 object-contain rounded"
                  />
                  <span className="text-primary font-semibold text-base">{agent.office_name}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                {agent.city && (
                  <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    {agent.city}
                  </span>
                )}
                {agent.license_number && (
                  <Badge variant="outline" className="gap-1">
                    <Award className="w-3 h-3" />
                    رخصة: {agent.license_number}
                  </Badge>
                )}
                <Badge variant="secondary">
                  <Building2 className="w-3 h-3 ml-1" />
                  {properties.length} عقار
                </Badge>
              </div>
              {agent.bio && (
                <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">{agent.bio}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`}>
                    <Button variant="outline" className="gap-2">
                      <Phone className="w-4 h-4" />
                      {agent.phone}
                    </Button>
                  </a>
                )}
                {agent.whatsapp && (
                  <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                      <MessageCircle className="w-4 h-4" />
                      واتساب
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Properties */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-heading font-bold mb-6">
          عقارات {agent.full_name}
        </h2>

        {propertiesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">لا توجد عقارات مضافة حالياً</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}