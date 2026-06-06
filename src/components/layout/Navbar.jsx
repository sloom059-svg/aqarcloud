import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Building2, LogOut, User, Plus, LayoutDashboard } from "lucide-react";
import { base44 } from '@/api/base44Client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)
    : '؟';

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="https://media.base44.com/images/public/6a218975cdf06fe8cd10f742/4f84b960a_10000065611.png"
              alt="الشعار"
              className="h-9 object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/add-property')}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">أضف عقار</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-primary/20 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4 ml-2" />
                  لوحة التحكم
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 ml-2" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}