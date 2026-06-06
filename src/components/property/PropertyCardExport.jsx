import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

// ── Canvas dimensions: Snapchat Story 9:16 ──────────────────────────────────
const CW = 1080;
const CH = 1920;

// ألوان البطاقة (نفس المتفق عليه)
const NAVY  = '#1e304a';   // الكحلي الأساسي
const NAVY9 = 'rgba(30,48,74,0.90)';
const WHITE = '#ffffff';
const SLATE = '#64748b';   // رمادي ثانوي للعناوين الصغيرة
const SLATE_LIGHT = '#94a3b8';
const LINE  = '#e2e8f0';   // حدود الأيقونات والفواصل
const ICON  = '#1e304a';   // لون كل الأيقونات (موحّد)

const fmt = (n) => n ? new Intl.NumberFormat('en-US').format(n) : '';

// ── Helpers ──────────────────────────────────────────────────────────────────
async function loadImg(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// تطبيع نوع الخدمة (يقبل مفتاح إنجليزي أو نص عربي)
function normType(t){
  if(!t) return 'default';
  const s = String(t).trim().toLowerCase();
  const map = {
    mosque:'mosque', school:'school', clinic:'clinic', hospital:'hospital',
    supermarket:'supermarket', park:'park', pharmacy:'pharmacy', mall:'mall', gym:'gym'
  };
  if(map[s]) return map[s];
  // عربي
  if(/مسجد|جامع/.test(s)) return 'mosque';
  if(/مدرس|روض|جامع[ةه]|كلي[ةه]|تعليم/.test(s)) return 'school';
  if(/مستوصف|مستشف|صح[ةي]|عياد|طب|مركز صحي/.test(s)) return 'clinic';
  if(/سوبر|بقال|تموين|هايبر|ماركت/.test(s)) return 'supermarket';
  if(/حديق|منتزه|متنزه|بارك/.test(s)) return 'park';
  if(/صيدل/.test(s)) return 'pharmacy';
  if(/مول|مجمع|تجاري|سوق/.test(s)) return 'mall';
  if(/نادي|جيم|رياض|لياق/.test(s)) return 'gym';
  return 'default';
}

// رسم أيقونة SVG (24x24 viewbox) بلون موحّد، outline style
function placeIcon(ctx, rawType, cx, cy, sz, col) {
  const type = normType(rawType);
  ctx.save();
  const s = sz / 24;
  ctx.translate(cx - sz / 2, cy - sz / 2);
  ctx.scale(s, s);
  ctx.strokeStyle = col;
  ctx.fillStyle   = col;
  ctx.lineWidth   = 2;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  const stroke = (fn) => { ctx.beginPath(); fn(); ctx.stroke(); };

  switch (type) {
    case 'mosque':
      stroke(() => { ctx.moveTo(3,21); ctx.lineTo(21,21); });
      stroke(() => { ctx.moveTo(5,21); ctx.lineTo(5,10); ctx.lineTo(12,5); ctx.lineTo(19,10); ctx.lineTo(19,21); });
      stroke(() => { ctx.moveTo(10,21); ctx.lineTo(10,15); ctx.lineTo(14,15); ctx.lineTo(14,21); });
      stroke(() => { ctx.moveTo(12,3); ctx.lineTo(12,5); });
      break;
    case 'school':
      stroke(() => { ctx.moveTo(22,10); ctx.lineTo(12,5); ctx.lineTo(2,10); ctx.lineTo(12,15); ctx.closePath(); });
      stroke(() => { ctx.moveTo(6,12); ctx.lineTo(6,17); ctx.bezierCurveTo(6,18.1,8.7,19,12,19); ctx.bezierCurveTo(15.3,19,18,18.1,18,17); ctx.lineTo(18,12); });
      break;
    case 'clinic':
    case 'hospital':
      ctx.fillStyle = col;
      ctx.fill(new Path2D('M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'));
      break;
    case 'supermarket':
      stroke(() => { ctx.moveTo(2,3); ctx.lineTo(4,3); ctx.lineTo(6.5,15); ctx.lineTo(18,15); ctx.lineTo(20,6); ctx.lineTo(5,6); });
      ctx.beginPath(); ctx.arc(9,19,1.6,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(17,19,1.6,0,Math.PI*2); ctx.fill();
      break;
    case 'park':
      stroke(() => { ctx.moveTo(5,14); ctx.lineTo(12,3); ctx.lineTo(19,14); ctx.closePath(); });
      stroke(() => { ctx.moveTo(7.5,19); ctx.lineTo(16.5,19); ctx.lineTo(12,12); ctx.closePath(); });
      stroke(() => { ctx.moveTo(12,19); ctx.lineTo(12,22); });
      break;
    case 'pharmacy':
      stroke(() => rr(ctx,7,4,10,16,2));
      stroke(() => { ctx.moveTo(12,8); ctx.lineTo(12,16); });
      stroke(() => { ctx.moveTo(8,12); ctx.lineTo(16,12); });
      break;
    case 'mall':
      stroke(() => { ctx.moveTo(3,9); ctx.lineTo(5,4); ctx.lineTo(19,4); ctx.lineTo(21,9); });
      stroke(() => rr(ctx,4,9,16,11,1));
      stroke(() => { ctx.moveTo(9,20); ctx.lineTo(9,14); ctx.lineTo(15,14); ctx.lineTo(15,20); });
      break;
    case 'gym':
      stroke(() => { ctx.moveTo(6,7); ctx.lineTo(6,17); });
      stroke(() => { ctx.moveTo(18,7); ctx.lineTo(18,17); });
      stroke(() => { ctx.moveTo(6,12); ctx.lineTo(18,12); });
      stroke(() => { ctx.moveTo(3,9); ctx.lineTo(3,15); });
      stroke(() => { ctx.moveTo(21,9); ctx.lineTo(21,15); });
      break;
    default:
      stroke(() => ctx.arc(12,12,8,0,Math.PI*2));
      stroke(() => { ctx.moveTo(12,8); ctx.lineTo(12,13); });
      ctx.beginPath(); ctx.arc(12,16,1,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// أيقونات التفاصيل (المساحة/الشارع/المخطط/القطعة...) — outline داخل دائرة
function specIcon(ctx, key, cx, cy, sz, col) {
  ctx.save();
  const s = sz / 24;
  ctx.translate(cx - sz/2, cy - sz/2);
  ctx.scale(s, s);
  ctx.strokeStyle = col; ctx.fillStyle = col;
  ctx.lineWidth = 2; ctx.lineCap='round'; ctx.lineJoin='round';
  const stroke=(fn)=>{ctx.beginPath();fn();ctx.stroke();};

  if (key==='area'){
    stroke(()=>{ctx.moveTo(8,3);ctx.lineTo(5,3);ctx.lineTo(5,6);});
    stroke(()=>{ctx.moveTo(16,3);ctx.lineTo(19,3);ctx.lineTo(19,6);});
    stroke(()=>{ctx.moveTo(8,21);ctx.lineTo(5,21);ctx.lineTo(5,18);});
    stroke(()=>{ctx.moveTo(16,21);ctx.lineTo(19,21);ctx.lineTo(19,18);});
  } else if (key==='street'){
    stroke(()=>{ctx.moveTo(4,22);ctx.lineTo(8,2);});
    stroke(()=>{ctx.moveTo(20,22);ctx.lineTo(16,2);});
    ctx.setLineDash([2,3]);
    stroke(()=>{ctx.moveTo(12,4);ctx.lineTo(12,20);});
    ctx.setLineDash([]);
  } else if (key==='plan'){
    stroke(()=>{ctx.moveTo(3,6);ctx.lineTo(9,3);ctx.lineTo(15,6);ctx.lineTo(21,3);ctx.lineTo(21,18);ctx.lineTo(15,21);ctx.lineTo(9,18);ctx.lineTo(3,21);ctx.closePath();});
    stroke(()=>{ctx.moveTo(9,3);ctx.lineTo(9,18);});
    stroke(()=>{ctx.moveTo(15,6);ctx.lineTo(15,21);});
  } else if (key==='plot'){
    stroke(()=>rr(ctx,4,4,16,16,2));
    [[8,8],[16,8],[8,16],[16,16]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,1.4,0,Math.PI*2);ctx.fill();});
  } else if (key==='rooms'){
    stroke(()=>{ctx.moveTo(3,18);ctx.lineTo(3,8);});
    stroke(()=>{ctx.moveTo(3,12);ctx.lineTo(21,12);ctx.lineTo(21,18);});
    stroke(()=>{ctx.moveTo(3,18);ctx.lineTo(21,18);});
    stroke(()=>{ctx.moveTo(7,12);ctx.lineTo(7,9);ctx.lineTo(13,9);ctx.lineTo(13,12);});
  } else if (key==='bath'){
    stroke(()=>{ctx.moveTo(4,12);ctx.lineTo(20,12);});
    stroke(()=>{ctx.moveTo(5,12);ctx.lineTo(5,17);ctx.bezierCurveTo(5,18.6,6.3,20,8,20);ctx.lineTo(16,20);ctx.bezierCurveTo(17.7,20,19,18.6,19,17);ctx.lineTo(19,12);});
    stroke(()=>{ctx.moveTo(7,12);ctx.lineTo(7,6);ctx.bezierCurveTo(7,4.9,7.9,4,9,4);});
  } else if (key==='halls'){
    stroke(()=>{ctx.moveTo(3,11);ctx.lineTo(3,9);ctx.bezierCurveTo(3,8,4,7,5,7);ctx.lineTo(19,7);ctx.bezierCurveTo(20,7,21,8,21,9);ctx.lineTo(21,11);});
    stroke(()=>rr(ctx,2,11,20,7,2));
    stroke(()=>{ctx.moveTo(5,18);ctx.lineTo(5,20);});
    stroke(()=>{ctx.moveTo(19,18);ctx.lineTo(19,20);});
  } else if (key==='floor'){
    stroke(()=>rr(ctx,4,3,16,18,1));
    stroke(()=>{ctx.moveTo(4,9);ctx.lineTo(20,9);});
    stroke(()=>{ctx.moveTo(4,15);ctx.lineTo(20,15);});
  } else if (key==='age'){
    stroke(()=>ctx.arc(12,12,9,0,Math.PI*2));
    stroke(()=>{ctx.moveTo(12,7);ctx.lineTo(12,12);ctx.lineTo(16,14);});
  } else if (key==='majalis'){
    stroke(()=>{ctx.moveTo(5,21);ctx.lineTo(5,8);ctx.bezierCurveTo(5,6.9,5.9,6,7,6);ctx.lineTo(17,6);ctx.bezierCurveTo(18.1,6,19,6.9,19,8);ctx.lineTo(19,21);});
    stroke(()=>{ctx.moveTo(5,14);ctx.lineTo(19,14);});
  } else {
    stroke(()=>ctx.arc(12,12,8,0,Math.PI*2));
  }
  ctx.restore();
}

// أيقونة بوصلة (للواجهة)
function compassIcon(ctx, cx, cy, sz, col){
  ctx.save();
  const s=sz/24; ctx.translate(cx-sz/2,cy-sz/2); ctx.scale(s,s);
  ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=2; ctx.lineJoin='round';
  ctx.beginPath(); ctx.arc(12,12,9,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(15.5,8.5); ctx.lineTo(10.5,10.5); ctx.lineTo(8.5,15.5); ctx.lineTo(13.5,13.5); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// أيقونة هاتف
function phoneIcon(ctx, cx, cy, sz, col){
  ctx.save();
  const s=sz/24; ctx.translate(cx-sz/2,cy-sz/2); ctx.scale(s,s);
  ctx.strokeStyle=col; ctx.lineWidth=2; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(22,16.92); ctx.lineTo(22,19.92);
  ctx.bezierCurveTo(22,21,21,22,19.8,21.9);
  ctx.bezierCurveTo(11,21,3,13,2.1,4.2);
  ctx.bezierCurveTo(2,3,3,2,4.08,2);
  ctx.lineTo(7,2);
  ctx.bezierCurveTo(8,2,8.9,2.7,9,3.7);
  ctx.lineTo(9.6,7.7);
  ctx.bezierCurveTo(9.7,8.4,9.5,9,9,9.4);
  ctx.lineTo(7.6,10.8);
  ctx.bezierCurveTo(9.1,13.6,10.4,14.9,13.2,16.4);
  ctx.lineTo(14.6,15);
  ctx.bezierCurveTo(15,14.5,15.6,14.3,16.3,14.4);
  ctx.lineTo(20.3,15);
  ctx.bezierCurveTo(21.3,15.1,22,16,22,16.92);
  ctx.stroke();
  ctx.restore();
}

// رسم QR وهمي (شكل فقط)
function drawQR(ctx, x, y, size, col){
  ctx.fillStyle = WHITE;
  rr(ctx, x, y, size, size, 8); ctx.fill();
  ctx.fillStyle = col;
  const p = size * 0.1;
  const m = (size - 2*p);
  const u = m / 7;
  const grid = [
    [1,1,1,0,1,1,1],
    [1,0,1,0,1,0,1],
    [1,1,1,0,1,1,1],
    [0,0,0,1,0,0,0],
    [1,1,0,1,0,1,1],
    [0,1,0,0,1,0,1],
    [1,0,1,1,0,1,1],
  ];
  for(let r=0;r<7;r++) for(let c=0;c<7;c++) if(grid[r][c])
    ctx.fillRect(x+p+c*u, y+p+r*u, u*0.92, u*0.92);
}

// ── Main draw function ────────────────────────────────────────────────────────
async function drawCard(property, agent) {
  const canvas = document.createElement('canvas');
  canvas.width  = CW;
  canvas.height = CH;
  const ctx = canvas.getContext('2d');

  ctx.textBaseline = 'middle';
  const f = (sz, w='700') => `${w} ${sz}px Tajawal, "Cairo", Arial`;

  // خلفية بيضاء
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, CW, CH);

  // ===== 1. HEADER =====
  const HEAD_H = 440;

  // الريبون (يسار)
  const RBW = 230, RBX = 0;
  ctx.fillStyle = NAVY;
  ctx.beginPath();
  ctx.moveTo(RBX, 0);
  ctx.lineTo(RBX + RBW, 0);
  ctx.lineTo(RBX + RBW, HEAD_H);
  ctx.lineTo(RBX + RBW/2, HEAD_H - 36);
  ctx.lineTo(RBX, HEAD_H);
  ctx.closePath();
  ctx.fill();

  // دائرة الموقع داخل الريبون
  const rbcx = RBX + RBW/2;
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(rbcx, 96, 38, 0, Math.PI*2); ctx.stroke();
  ctx.fillStyle = WHITE;
  ctx.beginPath(); ctx.arc(rbcx, 90, 9, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(rbcx-7,94); ctx.lineTo(rbcx+7,94); ctx.lineTo(rbcx,108); ctx.closePath(); ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = WHITE; ctx.font = f(32,'800');
  ctx.fillText(property.neighborhood ? `حي ${property.neighborhood}` : 'الحي', rbcx, 188);
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = f(26,'700');
  ctx.fillText(property.city || 'المدينة', rbcx, 228);

  // العنوان والحي والسعر (يمين)
  const PAD_R = 56;
  ctx.textAlign = 'right';

  const listingLabel = property.listing_type === 'إيجار' ? 'للإيجار' : 'للبيع';
  ctx.fillStyle = NAVY; ctx.font = f(72,'900');
  ctx.fillText(`${property.type} ${listingLabel}`, CW - PAD_R, 120);

  if (property.neighborhood) {
    ctx.fillStyle = SLATE; ctx.font = f(40,'700');
    ctx.fillText(`حي ${property.neighborhood}`, CW - PAD_R, 196);
  }

  // صندوق السعر
  const drawPriceBox = (segments) => {
    let total = 0;
    segments.forEach(s => { ctx.font = s.font; total += ctx.measureText(s.txt).width; });
    total += (segments.length) * 16;
    const bw = total + 56, bh = 84, bx = CW - PAD_R - bw, by = 248;
    rr(ctx, bx, by, bw, bh, 18); ctx.fillStyle = NAVY; ctx.fill();
    const cy = by + bh/2;
    let x = CW - PAD_R - 28;
    ctx.textAlign = 'right';
    segments.forEach(s => {
      ctx.font = s.font; ctx.fillStyle = s.color;
      ctx.fillText(s.txt, x, cy);
      x -= ctx.measureText(s.txt).width + 16;
    });
  };

  if (property.price_negotiable) {
    if (property.limit_price) {
      drawPriceBox([
        { txt: 'مسوّم بـ', font: f(30,'700'), color: WHITE },
        { txt: fmt(property.limit_price), font: f(44,'900'), color: WHITE },
        { txt: 'ر.س', font: f(24,'400'), color: 'rgba(255,255,255,0.7)' },
      ]);
    } else {
      const label = 'على السوم';
      ctx.font = f(38,'800');
      const bw = ctx.measureText(label).width + 64, bh = 84, bx = CW - PAD_R - bw, by = 248;
      rr(ctx, bx, by, bw, bh, 18); ctx.fillStyle = NAVY; ctx.fill();
      ctx.fillStyle = WHITE; ctx.textAlign = 'center';
      ctx.fillText(label, bx + bw/2, by + bh/2);
      ctx.textAlign = 'right';
    }
  } else if (property.price) {
    drawPriceBox([
      { txt: 'السعر', font: f(30,'700'), color: WHITE },
      { txt: fmt(property.price), font: f(46,'900'), color: WHITE },
      { txt: 'ر.س', font: f(24,'400'), color: 'rgba(255,255,255,0.7)' },
    ]);
  }

  // ===== 2. IMAGE =====
  const IMG_Y = HEAD_H;
  const IMG_H = 640;
  const mainImg = property.images?.[0] ? await loadImg(property.images[0]) : null;
  if (mainImg) {
    ctx.save();
    ctx.beginPath(); ctx.rect(0, IMG_Y, CW, IMG_H); ctx.clip();
    const sc = Math.max(CW / mainImg.width, IMG_H / mainImg.height);
    const dw = mainImg.width * sc, dh = mainImg.height * sc;
    ctx.drawImage(mainImg, (CW - dw)/2, IMG_Y + (IMG_H - dh)/2, dw, dh);
    ctx.restore();
  } else {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, IMG_Y, CW, IMG_H);
  }

  // شارة الواجهة (أسفل يمين الصورة)
  if (property.facade) {
    const ft = `الواجهة ${property.facade}`;
    ctx.font = f(28,'800');
    const tw = ctx.measureText(ft).width;
    const bw = tw + 90, bh = 64, bx = CW - 32 - bw, by = IMG_Y + IMG_H - 32 - bh;
    rr(ctx, bx, by, bw, bh, 14); ctx.fillStyle = NAVY9; ctx.fill();
    const cy = by + bh/2;
    ctx.fillStyle = WHITE; ctx.textAlign = 'right'; ctx.font = f(28,'800');
    ctx.fillText(ft, bx + bw - 22, cy);
    compassIcon(ctx, bx + 36, cy, 30, WHITE);
  }

  // ===== 3. التفاصيل + الخدمات =====
  let curY = IMG_Y + IMG_H;

  const specMap = [
    ['area',    'المساحة',      property.area && `${property.area} م²`],
    ['street',  'على شارع',     property.street_width && `${property.street_width} م`],
    ['plan',    'رقم المخطط',   property.plan_number],
    ['plot',    'رقم القطعة',   property.plot_number],
    ['rooms',   'غرف النوم',    property.bedrooms],
    ['bath',    'دورات المياه', property.bathrooms],
    ['halls',   'الصالات',      property.halls],
    ['floor',   'الدور',        property.floor],
    ['age',     'عمر العقار',   property.property_age && `${property.property_age} س`],
    ['majalis', 'المجالس',      property.majalis],
  ];
  const specs = specMap
    .filter(([,,v]) => v !== undefined && v !== null && v !== '' && v !== 0)
    .map(([key,label,val]) => ({ key, label, val: String(val) }))
    .slice(0, 4);

  if (specs.length > 0) {
    const COLS = specs.length;
    const SEC_H = 300;
    ctx.fillStyle = WHITE; ctx.fillRect(0, curY, CW, SEC_H);

    const colW = CW / COLS;
    specs.forEach((sp, i) => {
      const cx = CW - (i + 0.5) * colW;
      const icoY = curY + 88;

      ctx.strokeStyle = LINE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, icoY, 52, 0, Math.PI*2); ctx.stroke();
      specIcon(ctx, sp.key, cx, icoY, 44, ICON);

      ctx.textAlign = 'center';
      ctx.fillStyle = SLATE; ctx.font = f(24,'700');
      ctx.fillText(sp.label, cx, curY + 196);
      ctx.fillStyle = NAVY; ctx.font = f(40,'900');
      ctx.fillText(sp.val, cx, curY + 250);
    });

    curY += SEC_H;
  }

  // فاصل + عنوان الخدمات
  const nearby = (property.nearby_places || []).slice(0, 4);
  if (nearby.length > 0) {
    ctx.fillStyle = WHITE; ctx.fillRect(0, curY, CW, 120);
    ctx.strokeStyle = '#eef2f1'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(80, curY + 60); ctx.lineTo(CW-80, curY + 60); ctx.stroke();
    ctx.fillStyle = WHITE; const tw = 260;
    ctx.fillRect(CW/2 - tw/2, curY + 30, tw, 60);
    ctx.fillStyle = SLATE_LIGHT; ctx.font = f(34,'900'); ctx.textAlign = 'center';
    ctx.fillText('أقرب الخدمات', CW/2, curY + 62);
    curY += 120;

    const COLS = nearby.length;
    const colW = CW / COLS;
    const ROW_H = 240;
    ctx.fillStyle = WHITE; ctx.fillRect(0, curY, CW, ROW_H);

    nearby.forEach((place, i) => {
      const cx = CW - (i + 0.5) * colW;
      placeIcon(ctx, place.type || place.label, cx, curY + 60, 56, ICON);
      ctx.textAlign = 'center';
      ctx.fillStyle = NAVY; ctx.font = f(26,'800');
      ctx.fillText(place.label, cx, curY + 130);
      ctx.fillStyle = SLATE; ctx.font = f(22,'600');
      const dist = place.distance_label || (place.minutes ? `${place.minutes} دقائق` : '');
      ctx.fillText(dist, cx, curY + 172);
      if (place.distance_label && place.minutes) {
        ctx.fillStyle = SLATE_LIGHT; ctx.font = f(20,'600');
        ctx.fillText(`${place.minutes} دقائق`, cx, curY + 204);
      }
    });
    curY += ROW_H;
  }

  // ===== 4. FOOTER =====
  const FOOT_H = 230;
  const FOOT_Y = curY;
  ctx.fillStyle = NAVY; ctx.fillRect(0, FOOT_Y, CW, FOOT_H);
  const fMid = FOOT_Y + FOOT_H/2;
  const col = CW/3;

  // فواصل عمودية
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(col,   FOOT_Y+44); ctx.lineTo(col,   FOOT_Y+FOOT_H-44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(col*2, FOOT_Y+44); ctx.lineTo(col*2, FOOT_Y+FOOT_H-44); ctx.stroke();

  // العمود اليمين: البراند
  const c1 = CW - col/2;
  ctx.textAlign = 'center';
  ctx.fillStyle = WHITE; ctx.font = f(36,'900');
  ctx.fillText(agent?.office_name || 'عقار كلاود', c1, fMid - 16);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = f(24,'600');
  ctx.fillText(agent?.tagline || 'منصة الوسيط الذكية', c1, fMid + 26);

  // العمود الأوسط: التواصل
  const c2 = CW/2;
  const phoneNum = agent?.phone || '05xxxxxxxx';
  const icoX = c2 - col/2 + 56;
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(icoX, fMid, 34, 0, Math.PI*2); ctx.stroke();
  phoneIcon(ctx, icoX, fMid, 30, WHITE);
  const txtRight = c2 + col/2 - 36;
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = f(24,'600');
  ctx.fillText('للتواصل', txtRight, fMid - 16);
  ctx.fillStyle = WHITE; ctx.font = f(34,'900');
  ctx.fillText(phoneNum, txtRight, fMid + 26);

  // العمود اليسار: QR + الخريطة
  const qrSize = 108;
  drawQR(ctx, 44, fMid - qrSize/2, qrSize, NAVY);
  ctx.textAlign = 'right'; ctx.fillStyle = WHITE;
  ctx.font = f(26,'700');
  ctx.fillText('الموقع على', col - 36, fMid - 14);
  ctx.font = f(30,'900');
  ctx.fillText('الخريطة', col - 36, fMid + 26);

  // قص الكانفاس على الارتفاع الفعلي
  const finalH = FOOT_Y + FOOT_H;
  if (finalH < CH) {
    const trimmed = document.createElement('canvas');
    trimmed.width = CW; trimmed.height = finalH;
    trimmed.getContext('2d').drawImage(canvas, 0, 0);
    return trimmed;
  }
  return canvas;
}

// ── React Component ───────────────────────────────────────────────────────────
export default function PropertyCardExport({ property, agent }) {
  const [generating, setGenerating] = useState(false);
  const [preview,    setPreview]    = useState(null);

  useEffect(() => {
    let alive = true;
    drawCard(property, agent).then(c => {
      if (alive) setPreview(c.toDataURL('image/jpeg', 0.92));
    });
    return () => { alive = false; };
  }, [property?.id, agent?.id]);

  const download = async () => {
    setGenerating(true);
    const c = await drawCard(property, agent);
    const a = document.createElement('a');
    a.download = `عقار-${property.title || 'card'}.jpg`;
    a.href = c.toDataURL('image/jpeg', 0.95);
    a.click();
    setGenerating(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
        {preview
          ? <img src={preview} alt="بطاقة العقار" className="w-full h-auto block" />
          : <div className="w-full flex items-center justify-center" style={{ aspectRatio: '9 / 16' }}>
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        }
      </div>

      <Button onClick={download} disabled={generating || !preview} className="w-full gap-2 text-base py-5">
        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        تحميل البطاقة
      </Button>
      <p className="text-xs text-muted-foreground">بطاقة عقارية · عرض 1080</p>
    </div>
  );
}