export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  createdAt: string;
}

export interface Session {
  id: string;
  patientId: string;
  date: string;
  time: string;
  modality: 'presencial' | 'online';
  topics: string[];
  sleepPattern: string;
  mood: string[];
  eating: string;
  medication: {
    status: string;
    newMedication?: string;
  };
  approach: string;
  techniques: string[];
  dsmDiagnosis?: string[];
  cidDiagnosis?: string[];
  notes?: string;
  createdAt: string;
}

export type TherapyApproach = 'cognitiva' | 'psicodinamica' | 'humanista' | 'analise-comportamento';
