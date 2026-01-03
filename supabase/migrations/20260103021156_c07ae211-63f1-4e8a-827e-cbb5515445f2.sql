-- Enum para status do tratamento
CREATE TYPE public.treatment_status AS ENUM ('ativo', 'alta', 'abandono', 'encaminhado', 'suspenso');

-- Enum para tipo de sessão
CREATE TYPE public.session_type AS ENUM ('anamnese', 'regular', 'encerramento');

-- Enum para abordagem terapêutica
CREATE TYPE public.therapy_approach AS ENUM ('cognitiva', 'psicodinamica', 'humanista', 'analise-comportamento');

-- Enum para modalidade da sessão
CREATE TYPE public.session_modality AS ENUM ('presencial', 'online');

-- Tabela de perfis de usuários (psicólogos)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  crp TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, crp, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'crp', ''),
    new.email
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabela de pacientes (expandida)
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  birth_date DATE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  profession TEXT,
  is_minor BOOLEAN NOT NULL DEFAULT false,
  guardian_name TEXT,
  guardian_cpf TEXT,
  guardian_phone TEXT,
  guardian_relationship TEXT,
  current_status treatment_status NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own patients" ON public.patients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patients" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" ON public.patients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients" ON public.patients
  FOR DELETE USING (auth.uid() = user_id);

-- Tabela de histórico de status do paciente
CREATE TABLE public.patient_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  status treatment_status NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

ALTER TABLE public.patient_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view status history of their patients" ON public.patient_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = patient_status_history.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert status history for their patients" ON public.patient_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = patient_status_history.patient_id
      AND patients.user_id = auth.uid()
    )
    AND auth.uid() = created_by
  );

-- Tabela de sessões (expandida)
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type session_type NOT NULL DEFAULT 'regular',
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 50,
  modality session_modality NOT NULL,
  
  -- Estado geral
  topics TEXT[] NOT NULL DEFAULT '{}',
  sleep_pattern TEXT,
  mood TEXT[] NOT NULL DEFAULT '{}',
  eating TEXT,
  
  -- Medicação
  medication_status TEXT,
  medication_new TEXT,
  
  -- Abordagem e técnicas
  approach therapy_approach,
  techniques TEXT[] NOT NULL DEFAULT '{}',
  
  -- Diagnósticos
  dsm_diagnosis TEXT[] NOT NULL DEFAULT '{}',
  cid_diagnosis TEXT[] NOT NULL DEFAULT '{}',
  
  -- Campos de evolução (novos)
  clinical_observations TEXT,
  clinical_hypotheses TEXT,
  observed_progress TEXT,
  interventions TEXT,
  
  -- Encaminhamentos
  referral_needed BOOLEAN NOT NULL DEFAULT false,
  referral_to TEXT,
  referral_reason TEXT,
  
  -- Campos específicos de anamnese (primeira consulta)
  main_complaint TEXT,
  complaint_history TEXT,
  relevant_history TEXT,
  therapeutic_goals TEXT,
  treatment_plan TEXT,
  
  -- Observações gerais
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Tabela de documentos complementares
CREATE TABLE public.session_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.session_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents of their sessions" ON public.session_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = session_documents.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents for their sessions" ON public.session_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = session_documents.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents of their sessions" ON public.session_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = session_documents.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();