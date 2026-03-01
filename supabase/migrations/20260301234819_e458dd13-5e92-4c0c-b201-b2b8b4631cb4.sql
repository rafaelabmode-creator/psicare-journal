
-- Create storage bucket for profile logos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-logos', 'profile-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own logo
CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own logo
CREATE POLICY "Users can update their own logo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own logo
CREATE POLICY "Users can delete their own logo"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to logos
CREATE POLICY "Profile logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-logos');
