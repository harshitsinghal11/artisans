-- Drop existing tables if re-running
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS profiles;
DROP TYPE IF EXISTS product_status;

-- Create profiles table linked to auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TYPE product_status AS ENUM ('draft', 'processing', 'ready_for_review', 'published');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  raw_image_url TEXT,
  enhanced_image_url TEXT,
  raw_audio_url TEXT,
  transcript TEXT,
  description_en TEXT,
  description_hi TEXT,
  category TEXT,
  material_cost NUMERIC,
  suggested_price NUMERIC,
  price_reasoning TEXT,
  status product_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile." 
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for products
CREATE POLICY "Users can view their own products." 
  ON products FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products." 
  ON products FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products." 
  ON products FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products." 
  ON products FOR DELETE USING (auth.uid() = user_id);

-- Optional trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
