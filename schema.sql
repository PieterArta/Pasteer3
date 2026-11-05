-- Skema PostgreSQL PASTEER3 untuk Supabase

CREATE TYPE public.event_status AS ENUM ('mendatang', 'selesai');
CREATE TYPE public.applicant_status AS ENUM ('menunggu', 'diterima', 'ditolak');

-- 1. Site Stats
CREATE TABLE IF NOT EXISTS public.site_stats (
  id INT PRIMARY KEY DEFAULT 1,
  events_completed INT NOT NULL DEFAULT 0,
  total_volunteers INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inisialisasi baris default jika belum ada
INSERT INTO public.site_stats (id, events_completed, total_volunteers)
VALUES (1, 25, 300)
ON CONFLICT (id) DO NOTHING;

-- 2. Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE,
  location TEXT,
  description TEXT,
  status public.event_status NOT NULL DEFAULT 'mendatang',
  image_url TEXT,
  image_public_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Registration Forms
CREATE TABLE IF NOT EXISTS public.registration_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  total_quota INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Plotting
CREATE TABLE IF NOT EXISTS public.plotting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.registration_forms(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  quota INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Applicants
CREATE TABLE IF NOT EXISTS public.applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.registration_forms(id) ON DELETE CASCADE,
  plotting_id UUID REFERENCES public.plotting(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  instagram TEXT,
  jersey_size TEXT,
  domicile TEXT,
  reason TEXT,
  cv_url TEXT,
  cv_path TEXT,
  status public.applicant_status NOT NULL DEFAULT 'menunggu',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT,
  image_url TEXT NOT NULL,
  image_public_id TEXT,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Admins (terhubung dengan auth.users.id)
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS & Grants
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plotting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Grant permissions ke service_role, anon, dan authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Kebijakan baca publik (SELECT) untuk pengunjung
CREATE POLICY "Public read site_stats" ON public.site_stats FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public read forms" ON public.registration_forms FOR SELECT USING (true);
CREATE POLICY "Public read plotting" ON public.plotting FOR SELECT USING (true);

-- Kebijakan admin: akses penuh jika user terdaftar di admins (atau via service_role bypass)
CREATE POLICY "Admin manage site_stats" ON public.site_stats FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Admin manage events" ON public.events FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Admin manage gallery" ON public.gallery FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Admin manage forms" ON public.registration_forms FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Admin manage plotting" ON public.plotting FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Admin manage applicants" ON public.applicants FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Admin view admins" ON public.admins FOR SELECT TO authenticated USING (id = auth.uid());
