import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, CalendarDays, Loader2, Home, MapPin, Banknote, Hotel, Tent, Leaf, Trees, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const VENUE_TYPE_ICONS = {
  'شاليه': Hotel,
  'مخيم': Tent,
  'مزرعة': Leaf,
  'استراحة': Trees,
};

export default function VenueDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues', user?.id],
    queryFn: () => base44.entities.Venue.filter({ owner_id: user?.id }, '-created_date'),
    enabled: !!user?.id,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings-all', user?.id],
    queryFn: () => base44.entities.Booking.filter({ owner_id: user?.id }),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Venue.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venues'] }),
  });

  const getBookingCount = (venueId) => bookings.filter(b => b.venue_id === venueId).length;
  const getNewBookings = (venueId) => bookings.filter(b => b.venue_id === venueId && b.status === 'جديد').length;

  const handleShare = (venue) => {
    const url = `${window.location.origin}/place/${venue.slug || venue.id}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط مشاركة الصفحة بنجاح!');
  };

  const venueTypeName = user?.business_type || 'شاليه';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-heading">لوحة التحكم</h1>
              <p className="text-primary-foreground/70 text-sm mt-1">
                {(() => { const Icon = VENUE_TYPE_ICONS[venueTypeName]; return Icon ? <Icon className="inline w-4 h-4 ml-1" /> : null; })()}
                مرحباً، {user?.full_name || user?.office_name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  الملف الشخصي
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{venues.length}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">أماكني</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{bookings.length}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">الحجوزات</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-300">
                {bookings.filter(b => b.status === 'جديد').length}
              </div>
              <div className="text-sm text-primary-foreground/70 mt-1">طلبات جديدة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">أماكني</h2>
          <Link to="/venue/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة مكان جديد
            </Button>
          </Link>
        </div>

        {venues.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4">{(() => { const Icon = VENUE_TYPE_ICONS[venueTypeName] || Hotel; return <Icon className="w-16 h-16 mx-auto text-muted-foreground/30" />; })()}</div>
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد أماكن بعد</h3>
            <p className="text-muted-foreground mb-6">أضف مكانك الأول وابدأ في استقبال الحجوزات</p>
            <Link to="/venue/add">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                إضافة مكان جديد
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {venues.map(venue => {
              const newCount = getNewBookings(venue.id);
              return (
                <div key={venue.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative h-44 bg-muted">
                    {venue.images?.[0] ? (
                      <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        {(() => { const Icon = VENUE_TYPE_ICONS[venue.venue_type] || Hotel; return <Icon className="w-12 h-12 text-muted-foreground/40" />; })()}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={venue.status === 'نشط' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}>
                        {venue.status}
                      </Badge>
                      <Badge variant="secondary">{venue.venue_type}</Badge>
                    </div>
                    {newCount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {newCount}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{venue.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {venue.city}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {getBookingCount(venue.id)} حجز</span>
                      {venue.price_weekend && <span className="flex items-center gap-1"><Banknote className="w-3.5 h-3.5" /> {venue.price_weekend.toLocaleString('ar-SA')} ر.س / ويكند</span>}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link to={`/venue/edit/${venue.id}`}>
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <Edit className="w-3.5 h-3.5" /> تعديل
                        </Button>
                      </Link>
                      <Link to={`/venue/bookings/${venue.id}`}>
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <CalendarDays className="w-3.5 h-3.5" /> الحجوزات
                          {newCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1">{newCount}</span>}
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="w-full gap-1 text-primary border-primary hover:bg-primary/5" onClick={() => handleShare(venue)}>
                        <Share2 className="w-3.5 h-3.5" /> مشاركة الصفحة
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full gap-1 text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" /> حذف
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف المكان</AlertDialogTitle>
                            <AlertDialogDescription>هل أنت متأكد من حذف "{venue.name}"؟ لا يمكن التراجع.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive" onClick={() => deleteMutation.mutate(venue.id)}>حذف</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}