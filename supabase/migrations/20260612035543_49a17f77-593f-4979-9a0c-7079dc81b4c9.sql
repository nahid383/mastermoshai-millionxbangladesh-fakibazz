
CREATE TABLE public.cq_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id text NOT NULL,
  subject_name text,
  level text,
  medium text,
  mode text NOT NULL,
  question jsonb NOT NULL,
  answer_text text,
  evaluation jsonb NOT NULL,
  total_score integer NOT NULL,
  max_score integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cq_submissions TO authenticated;
GRANT ALL ON public.cq_submissions TO service_role;
ALTER TABLE public.cq_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own cq submissions" ON public.cq_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own cq submissions" ON public.cq_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own cq submissions" ON public.cq_submissions FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX cq_submissions_user_created_idx ON public.cq_submissions(user_id, created_at DESC);
