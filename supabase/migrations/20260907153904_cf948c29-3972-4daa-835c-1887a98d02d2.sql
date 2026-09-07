CREATE TABLE public.generated_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'shopify',
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  format TEXT NOT NULL,
  theme TEXT NOT NULL,
  objective TEXT NOT NULL,
  image_url TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT '',
  core_idea TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  cta TEXT NOT NULL DEFAULT '',
  favorite BOOLEAN NOT NULL DEFAULT false,
  collection_ids TEXT[] NOT NULL DEFAULT '{}'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_ads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_ads TO authenticated;
GRANT ALL ON public.generated_ads TO service_role;

ALTER TABLE public.generated_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo: anyone can read generated ads" ON public.generated_ads FOR SELECT USING (true);
CREATE POLICY "Demo: anyone can create generated ads" ON public.generated_ads FOR INSERT WITH CHECK (true);
CREATE POLICY "Demo: anyone can update generated ads" ON public.generated_ads FOR UPDATE USING (true);
CREATE POLICY "Demo: anyone can delete generated ads" ON public.generated_ads FOR DELETE USING (true);

CREATE POLICY "Demo: public read ad images" ON storage.objects FOR SELECT USING (bucket_id = 'ad-images');
CREATE POLICY "Demo: public upload ad images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ad-images');