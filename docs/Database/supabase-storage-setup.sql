-- Execute this script in your Supabase SQL Editor to create the necessary buckets
-- and set up public access policies.

-- Create product-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create product-audio bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-audio', 'product-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public read access for product-images
CREATE POLICY "Public Access product-images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Enable authenticated upload access for product-images
CREATE POLICY "Auth Upload product-images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

-- Enable public read access for product-audio
CREATE POLICY "Public Access product-audio" ON storage.objects
FOR SELECT USING (bucket_id = 'product-audio');

-- Enable authenticated upload access for product-audio
CREATE POLICY "Auth Upload product-audio" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-audio');
