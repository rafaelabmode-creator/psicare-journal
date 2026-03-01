
-- Add clinic_address and logo_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clinic_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;
