-- Create storage bucket for session documents
INSERT INTO storage.buckets (id, name, public) VALUES ('session-documents', 'session-documents', false);

-- Create policies for document storage
CREATE POLICY "Users can upload their own session documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'session-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own session documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'session-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own session documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'session-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add UPDATE policy for session_documents table
CREATE POLICY "Users can update documents of their sessions"
ON public.session_documents
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM sessions
  WHERE sessions.id = session_documents.session_id
  AND sessions.user_id = auth.uid()
));