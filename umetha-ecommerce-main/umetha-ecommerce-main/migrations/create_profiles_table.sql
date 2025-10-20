-- Create a new profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  shipping_addresses JSONB DEFAULT '[]'::jsonb,
  billing_addresses JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

-- Make sure the table has RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies to restrict operations
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, full_name)
  VALUES (
    NEW.id, 
    COALESCE((NEW.raw_user_meta_data->>'first_name')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'last_name')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'full_name')::TEXT, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a function to handle existing users (one-time migration)
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT * FROM auth.users
  LOOP
    INSERT INTO public.profiles (id, first_name, last_name, full_name, created_at)
    VALUES (
      user_record.id,
      COALESCE((user_record.raw_user_meta_data->>'first_name')::TEXT, ''),
      COALESCE((user_record.raw_user_meta_data->>'last_name')::TEXT, ''),
      COALESCE((user_record.raw_user_meta_data->>'full_name')::TEXT, ''),
      user_record.created_at
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to create profiles for existing users
SELECT public.create_missing_profiles();