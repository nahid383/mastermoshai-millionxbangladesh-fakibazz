-- Drop the old check constraint and add a new one that includes 'admission'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_level_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_level_check CHECK (level IN ('ssc', 'hsc', 'admission'));