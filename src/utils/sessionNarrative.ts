import { Session, Patient } from '@/types';
import {
  sleepPatterns,
  moods,
  eatingPatterns,
  medicationStatus,
  therapyApproaches,
  dsmDiagnoses,
  cidDiagnoses,
} from '@/data/psychologyData';

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  return options.find((o) => o.value === value)?.label || value;
};

const getDiagnosisLabel = (code: string, diagnoses: { code: string; name: string }[]) => {
  const diag = diagnoses.find((d) => d.code === code);
  return diag ? `${diag.name} (${diag.code})` : code;
};

const formatDateLong = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatMoodList = (moodValues: string[]) => {
  const labels = moodValues.map((m) => getLabel(m, moods).toLowerCase());
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} e ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')} e ${labels[labels.length - 1]}`;
};

const formatTopicsList = (topics: string[]) => {
  const lowercased = topics.map((t) => t.toLowerCase());
  if (lowercased.length === 1) return lowercased[0];
  if (lowercased.length === 2) return `${lowercased[0]} e ${lowercased[1]}`;
  return `${lowercased.slice(0, -1).join(', ')} e ${lowercased[lowercased.length - 1]}`;
};

const formatTechniquesList = (techniques: string[]) => {
  if (techniques.length === 1) return techniques[0];
  if (techniques.length === 2) return `${techniques[0]} e ${techniques[1]}`;
  return `${techniques.slice(0, -1).join(', ')} e ${techniques[techniques.length - 1]}`;
};

// Texto corrido completo para prontuário (uso profissional)
export function generateSessionNarrative(session: Session, patient: Patient): string {
  const date = formatDateLong(session.date);
  const modality = session.modality === 'presencial' ? 'presencial' : 'online';
  const approach = getLabel(session.approach, therapyApproaches);
  const sleep = getLabel(session.sleepPattern, sleepPatterns).toLowerCase();
  const eating = getLabel(session.eating, eatingPatterns).toLowerCase();
  const moodText = formatMoodList(session.mood);
  const topicsText = formatTopicsList(session.topics);
  const medicationText = getLabel(session.medication.status, medicationStatus).toLowerCase();

  let narrative = `REGISTRO DE SESSÃO\n\n`;
  narrative += `Paciente: ${patient.name}\n`;
  narrative += `Data: ${date}\n`;
  narrative += `Horário: ${session.time}\n`;
  narrative += `Modalidade: ${modality.charAt(0).toUpperCase() + modality.slice(1)}\n\n`;
  
  narrative += `EVOLUÇÃO DO ATENDIMENTO\n\n`;
  
  narrative += `Na sessão realizada em ${date}, no formato ${modality}, foram abordadas questões relacionadas a ${topicsText}. `;
  
  narrative += `O(A) paciente apresentou humor ${moodText}, `;
  narrative += `com padrão de sono ${sleep} `;
  narrative += `e alimentação ${eating}. `;
  
  if (session.medication.status !== 'sem-medicacao') {
    narrative += `Em relação à medicação, o(a) paciente relata que está ${medicationText}`;
    if (session.medication.newMedication) {
      narrative += `, sendo a nova terapêutica: ${session.medication.newMedication}`;
    }
    narrative += `. `;
  }
  
  narrative += `\n\nA intervenção foi conduzida sob a perspectiva da ${approach}`;
  
  if (session.techniques.length > 0) {
    narrative += `, utilizando-se as seguintes técnicas: ${formatTechniquesList(session.techniques)}`;
  }
  narrative += `. `;
  
  if ((session.dsmDiagnosis && session.dsmDiagnosis.length > 0) || 
      (session.cidDiagnosis && session.cidDiagnosis.length > 0)) {
    narrative += `\n\nCLASSIFICAÇÃO DIAGNÓSTICA\n\n`;
    
    if (session.dsmDiagnosis && session.dsmDiagnosis.length > 0) {
      const dsmLabels = session.dsmDiagnosis.map((code) => getDiagnosisLabel(code, dsmDiagnoses));
      narrative += `DSM-5-TR: ${dsmLabels.join('; ')}. `;
    }
    
    if (session.cidDiagnosis && session.cidDiagnosis.length > 0) {
      const cidLabels = session.cidDiagnosis.map((code) => getDiagnosisLabel(code, cidDiagnoses));
      narrative += `CID-10: ${cidLabels.join('; ')}. `;
    }
  }
  
  if (session.notes) {
    narrative += `\n\nOBSERVAÇÕES ADICIONAIS\n\n${session.notes}`;
  }
  
  narrative += `\n\n---\nRegistro realizado em conformidade com a Resolução CFP nº 001/2009.`;
  
  return narrative;
}

// Relatório simplificado para o paciente (sem informações técnicas sensíveis)
export function generatePatientReport(session: Session, patient: Patient): string {
  const date = formatDateLong(session.date);
  const modality = session.modality === 'presencial' ? 'presencial' : 'online';
  const approach = getLabel(session.approach, therapyApproaches);
  const topicsText = formatTopicsList(session.topics);
  
  let report = `RELATÓRIO DE ATENDIMENTO PSICOLÓGICO\n\n`;
  report += `Paciente: ${patient.name}\n`;
  report += `Data do Atendimento: ${date}\n`;
  report += `Horário: ${session.time}\n`;
  report += `Modalidade: ${modality.charAt(0).toUpperCase() + modality.slice(1)}\n\n`;
  
  report += `---\n\n`;
  
  report += `Declaro para os devidos fins que o(a) paciente acima identificado(a) compareceu a sessão de psicoterapia individual na data e horário especificados.\n\n`;
  
  report += `Durante o atendimento, foram trabalhadas questões relacionadas a ${topicsText}, `;
  report += `utilizando a abordagem ${approach}`;
  
  if (session.techniques.length > 0) {
    report += ` com aplicação de técnicas terapêuticas adequadas ao caso`;
  }
  report += `.\n\n`;
  
  report += `O acompanhamento psicológico está sendo realizado conforme o plano terapêutico estabelecido, visando o bem-estar e a qualidade de vida do(a) paciente.\n\n`;
  
  report += `---\n\n`;
  report += `Este documento foi emitido a pedido do(a) paciente e tem validade para os fins a que se destina.\n\n`;
  report += `Documento emitido em conformidade com o Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005) e a Resolução CFP nº 007/2003 que institui o Manual de Elaboração de Documentos Escritos.`;
  
  return report;
}
