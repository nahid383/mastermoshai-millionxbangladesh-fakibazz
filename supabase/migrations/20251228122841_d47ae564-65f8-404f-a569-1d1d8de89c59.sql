-- Remove overly permissive RLS policies on questions table
-- These policies allow any authenticated user to modify/delete questions, which is a security risk

-- Drop the dangerous policies
DROP POLICY IF EXISTS "Authenticated users can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Authenticated users can update questions" ON public.questions;
DROP POLICY IF EXISTS "Authenticated users can delete questions" ON public.questions;

-- Questions should only be managed through admin-controlled processes (edge functions, migrations, etc.)
-- The "Anyone can view questions" policy remains for reading