// Enums
export type TreatmentStatus = 'ativo' | 'alta' | 'abandono' | 'encaminhado' | 'suspenso';
export type SessionType = 'anamnese' | 'regular' | 'encerramento';
export type TherapyApproach = 'cognitiva' | 'psicodinamica' | 'humanista' | 'analise-comportamento';
export type SessionModality = 'presencial' | 'online';

// Profile do psicólogo
export interface Profile {
  id: string;
  full_name: string;
  crp: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// Paciente (expandido)
export interface Patient {
  id: string;
  user_id: string;
  name: string;
  cpf: string;
  birth_date: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  profession: string | null;
  is_minor: boolean;
  guardian_name: string | null;
  guardian_cpf: string | null;
  guardian_phone: string | null;
  guardian_relationship: string | null;
  current_status: TreatmentStatus;
  created_at: string;
  updated_at: string;
}

// Histórico de status do paciente
export interface PatientStatusHistory {
  id: string;
  patient_id: string;
  status: TreatmentStatus;
  reason: string;
  notes: string | null;
  changed_at: string;
  created_by: string;
}

// Sessão (expandida)
export interface Session {
  id: string;
  patient_id: string;
  user_id: string;
  session_type: SessionType;
  date: string;
  time: string;
  duration_minutes: number;
  modality: SessionModality;
  
  // Estado geral
  topics: string[];
  sleep_pattern: string | null;
  mood: string[];
  eating: string | null;
  
  // Medicação
  medication_status: string | null;
  medication_new: string | null;
  
  // Abordagem e técnicas
  approach: TherapyApproach | null;
  techniques: string[];
  
  // Diagnósticos
  dsm_diagnosis: string[];
  cid_diagnosis: string[];
  
  // Campos de evolução
  clinical_observations: string | null;
  clinical_hypotheses: string | null;
  observed_progress: string | null;
  interventions: string | null;
  
  // Encaminhamentos
  referral_needed: boolean;
  referral_to: string | null;
  referral_reason: string | null;
  
  // Campos específicos de anamnese (primeira consulta)
  main_complaint: string | null;
  complaint_history: string | null;
  relevant_history: string | null;
  therapeutic_goals: string | null;
  treatment_plan: string | null;
  
  // Observações gerais
  notes: string | null;
  
  created_at: string;
  updated_at: string;
}

// Documento de sessão
export interface SessionDocument {
  id: string;
  session_id: string;
  document_type: string;
  description: string | null;
  file_path: string | null;
  created_at: string;
}

// Tipos para formulários
export interface PatientFormData {
  name: string;
  cpf: string;
  birth_date: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  profession?: string;
  is_minor: boolean;
  guardian_name?: string;
  guardian_cpf?: string;
  guardian_phone?: string;
  guardian_relationship?: string;
}

export interface SessionFormData {
  session_type: SessionType;
  date: string;
  time: string;
  duration_minutes: number;
  modality: SessionModality;
  topics: string[];
  sleep_pattern: string;
  mood: string[];
  eating: string;
  medication_status: string;
  medication_new?: string;
  approach: string;
  techniques: string[];
  dsm_diagnosis: string[];
  cid_diagnosis: string[];
  clinical_observations?: string;
  clinical_hypotheses?: string;
  observed_progress?: string;
  interventions?: string;
  referral_needed: boolean;
  referral_to?: string;
  referral_reason?: string;
  main_complaint?: string;
  complaint_history?: string;
  relevant_history?: string;
  therapeutic_goals?: string;
  treatment_plan?: string;
  notes?: string;
}
