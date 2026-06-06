# ✅ تم تحويل المشروع من base44 إلى Supabase

## الملفات المعدّلة:
1. `src/api/base44Client.js` — طبقة توافق كاملة (الأهم)
2. `src/lib/AuthContext.jsx` — نظام الدخول عبر Supabase
3. `src/lib/app-params.js` — تفريغه
4. `vite.config.js` — إزالة base44 plugin
5. `package.json` — إزالة base44 وإضافة supabase
6. حذف مجلد `base44/`

## ⚠️ خطوات مهمة بعد الرفع:

### 1. في Supabase أنشئ جدول profiles (لبيانات المستخدمين):
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  office_name TEXT,
  business_type TEXT,
  phone TEXT,
  city TEXT,
  role TEXT DEFAULT 'user'
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "users update own" ON profiles FOR ALL USING (auth.uid() = id);
```

### 2. أنشئ Storage Bucket للصور:
Supabase → Storage → New Bucket → اسم: `images` → Public ✅

### 3. في Vercel أضف:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
