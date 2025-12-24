-- Add admission fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admission_year text,
ADD COLUMN IF NOT EXISTS target_university text,
ADD COLUMN IF NOT EXISTS target_department text,
ADD COLUMN IF NOT EXISTS exam_date text;