-- Add new columns to profiles table for additional user information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS institution TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update the handle_new_user function to store additional data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, level, institution, location)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'name',
    COALESCE(new.raw_user_meta_data ->> 'education_level', 'ssc'),
    new.raw_user_meta_data ->> 'institution',
    new.raw_user_meta_data ->> 'location'
  );
  RETURN new;
END;
$$;