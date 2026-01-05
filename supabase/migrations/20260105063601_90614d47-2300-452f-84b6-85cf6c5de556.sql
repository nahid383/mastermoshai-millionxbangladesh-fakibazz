-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'guardian', 'admin');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create guardian_links table (links guardians to students)
CREATE TABLE public.guardian_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    approved_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (guardian_id, student_id)
);

ALTER TABLE public.guardian_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guardians can view their links"
ON public.guardian_links FOR SELECT
USING (auth.uid() = guardian_id OR auth.uid() = student_id);

CREATE POLICY "Guardians can create links"
ON public.guardian_links FOR INSERT
WITH CHECK (auth.uid() = guardian_id);

CREATE POLICY "Students can update link status"
ON public.guardian_links FOR UPDATE
USING (auth.uid() = student_id);

-- Create study_plans table for AI-generated study plans
CREATE TABLE public.study_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_data jsonb NOT NULL DEFAULT '{}',
    target_university TEXT,
    exam_date DATE,
    weekly_hours INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study plans"
ON public.study_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study plans"
ON public.study_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans"
ON public.study_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans"
ON public.study_plans FOR DELETE
USING (auth.uid() = user_id);

-- Create quiz_attempts table to track detailed quiz performance
CREATE TABLE public.quiz_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'medium',
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL,
    time_taken INTEGER, -- in seconds
    is_timed BOOLEAN DEFAULT false,
    answers jsonb DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Guardians can view linked students' quiz attempts
CREATE POLICY "Guardians can view linked student attempts"
ON public.quiz_attempts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.guardian_links
        WHERE guardian_id = auth.uid()
        AND student_id = quiz_attempts.user_id
        AND status = 'approved'
    )
);

-- Create doubt_sessions table for Smart Doubt Resolver
CREATE TABLE public.doubt_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id TEXT,
    topic TEXT,
    messages jsonb DEFAULT '[]',
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doubt_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own doubt sessions"
ON public.doubt_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own doubt sessions"
ON public.doubt_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doubt sessions"
ON public.doubt_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Create mental_support_sessions table for Exam Anxiety Support
CREATE TABLE public.mental_support_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mood_level INTEGER, -- 1-10 scale
    stress_level INTEGER, -- 1-10 scale
    messages jsonb DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mental_support_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mental support sessions"
ON public.mental_support_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mental support sessions"
ON public.mental_support_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mental support sessions"
ON public.mental_support_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Create university_prep table for university-specific preparation
CREATE TABLE public.university_prep (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    university TEXT NOT NULL, -- DU, BUET, RUET, CUET, GST, etc.
    target_unit TEXT, -- A, B, C, D for DU, etc.
    progress jsonb DEFAULT '{}',
    mock_tests_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.university_prep ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own university prep"
ON public.university_prep FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own university prep"
ON public.university_prep FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own university prep"
ON public.university_prep FOR UPDATE
USING (auth.uid() = user_id);

-- Create answer_evaluations table for Board Answer Checking
CREATE TABLE public.answer_evaluations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id TEXT NOT NULL,
    topic TEXT,
    question TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    ai_feedback jsonb,
    score INTEGER,
    max_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.answer_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own answer evaluations"
ON public.answer_evaluations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own answer evaluations"
ON public.answer_evaluations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_study_plans_updated_at
BEFORE UPDATE ON public.study_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doubt_sessions_updated_at
BEFORE UPDATE ON public.doubt_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_university_prep_updated_at
BEFORE UPDATE ON public.university_prep
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();