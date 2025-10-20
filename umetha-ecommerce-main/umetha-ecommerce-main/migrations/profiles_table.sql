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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add a public function to update profiles
CREATE OR REPLACE FUNCTION update_profile(
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT
) RETURNS SETOF profiles AS $$
BEGIN
  RETURN QUERY
    UPDATE public.profiles
    SET
      first_name = COALESCE(update_profile.first_name, profiles.first_name),
      last_name = COALESCE(update_profile.last_name, profiles.last_name),
      full_name = COALESCE(
        NULLIF(CONCAT(update_profile.first_name, ' ', update_profile.last_name), ' '),
        profiles.full_name
      ),
      avatar_url = COALESCE(update_profile.avatar_url, profiles.avatar_url),
      phone_number = COALESCE(update_profile.phone_number, profiles.phone_number),
      address = COALESCE(update_profile.address, profiles.address),
      city = COALESCE(update_profile.city, profiles.city),
      state = COALESCE(update_profile.state, profiles.state),
      postal_code = COALESCE(update_profile.postal_code, profiles.postal_code),
      country = COALESCE(update_profile.country, profiles.country),
      updated_at = now()
    WHERE id = auth.uid()
    RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;