import React from "react";

const LOGO_URL = "https://media.base44.com/images/public/6a218975cdf06fe8cd10f742/4f84b960a_10000065611.png";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <div className="mb-3 flex justify-center">
            <img src={LOGO_URL} alt="عقار كلاود" className="w-44 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-4">{footer}</p>
        )}
      </div>
    </div>
  );
}