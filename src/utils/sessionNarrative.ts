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
  const approach = session.approach ? getLabel(session.approach, therapyApproaches) : 'não especificada';
  const sleep = session.sleep_pattern ? getLabel(session.sleep_pattern, sleepPatterns).toLowerCase() : 'não informado';
  const eating = session.eating ? getLabel(session.eating, eatingPatterns).toLowerCase() : 'não informada';
  const moodText = session.mood.length > 0 ? formatMoodList(session.mood) : 'não informado';
  const topicsText = session.topics.length > 0 ? formatTopicsList(session.topics) : 'não especificadas';
  const medicationText = session.medication_status ? getLabel(session.medication_status, medicationStatus).toLowerCase() : 'não informado';

  // Texto específico para ANAMNESE
  if (session.session_type === 'anamnese') {
    let narrative = `REGISTRO DE PRIMEIRA CONSULTA (ANAMNESE)\n\n`;
    narrative += `Paciente: ${patient.name}\n`;
    narrative += `Data: ${date}\n`;
    narrative += `Horário: ${session.time}\n`;
    narrative += `Duração: ${session.duration_minutes} minutos\n`;
    narrative += `Modalidade: ${modality.charAt(0).toUpperCase() + modality.slice(1)}\n\n`;
    
    narrative += `IDENTIFICAÇÃO E CONTEXTO INICIAL\n\n`;
    narrative += `Realizou-se a primeira consulta com o(a) paciente ${patient.name} em ${date}, no formato ${modality}, com duração de ${session.duration_minutes} minutos. `;
    narrative += `O objetivo desta sessão foi realizar a avaliação inicial, compreender a demanda trazida pelo(a) paciente e estabelecer as bases para o processo terapêutico.\n\n`;
    
    if (session.main_complaint) {
      narrative += `QUEIXA PRINCIPAL\n\n`;
      narrative += `O(A) paciente apresentou como queixa principal: ${session.main_complaint}\n\n`;
    }
    
    if (session.complaint_history) {
      narrative += `HISTÓRICO DA QUEIXA\n\n`;
      narrative += `${session.complaint_history}\n\n`;
    }
    
    if (session.relevant_history) {
      narrative += `HISTÓRICO RELEVANTE\n\n`;
      narrative += `${session.relevant_history}\n\n`;
    }
    
    narrative += `AVALIAÇÃO DO ESTADO ATUAL\n\n`;
    narrative += `Durante a avaliação inicial, observou-se que o(a) paciente apresenta humor ${moodText}. `;
    narrative += `Quanto aos aspectos de rotina, relata padrão de sono ${sleep} e alimentação ${eating}. `;
    
    if (session.medication_status && session.medication_status !== 'sem-medicacao') {
      narrative += `Em relação à medicação, o(a) paciente informa que está ${medicationText}`;
      if (session.medication_new) {
        narrative += `, sendo a medicação atual: ${session.medication_new}`;
      }
      narrative += `. `;
    }
    narrative += `\n\n`;
    
    if (session.clinical_observations) {
      narrative += `OBSERVAÇÕES CLÍNICAS\n\n`;
      narrative += `${session.clinical_observations}\n\n`;
    }
    
    if (session.clinical_hypotheses) {
      narrative += `HIPÓTESES CLÍNICAS INICIAIS\n\n`;
      narrative += `${session.clinical_hypotheses}\n\n`;
    }
    
    if (session.therapeutic_goals) {
      narrative += `OBJETIVOS TERAPÊUTICOS\n\n`;
      narrative += `${session.therapeutic_goals}\n\n`;
    }
    
    if (session.treatment_plan) {
      narrative += `PLANO DE TRATAMENTO\n\n`;
      narrative += `${session.treatment_plan}\n\n`;
    }
    
    if (session.approach) {
      narrative += `ABORDAGEM TERAPÊUTICA\n\n`;
      narrative += `A condução do processo terapêutico será realizada sob a perspectiva da ${approach}`;
      if (session.techniques.length > 0) {
        narrative += `, podendo utilizar técnicas como: ${formatTechniquesList(session.techniques)}`;
      }
      narrative += `.\n\n`;
    }
    
    // Encaminhamentos
    if (session.referral_needed && session.referral_to) {
      narrative += `ENCAMINHAMENTO\n\n`;
      narrative += `Identificou-se necessidade de encaminhamento para: ${session.referral_to}`;
      if (session.referral_reason) {
        narrative += `\nJustificativa: ${session.referral_reason}`;
      }
      narrative += `\n\n`;
    }
    
    if ((session.dsm_diagnosis && session.dsm_diagnosis.length > 0) || 
        (session.cid_diagnosis && session.cid_diagnosis.length > 0)) {
      narrative += `HIPÓTESE DIAGNÓSTICA INICIAL\n\n`;
      
      if (session.dsm_diagnosis && session.dsm_diagnosis.length > 0) {
        const dsmLabels = session.dsm_diagnosis.map((code) => getDiagnosisLabel(code, dsmDiagnoses));
        narrative += `DSM-5-TR: ${dsmLabels.join('; ')}. `;
      }
      
      if (session.cid_diagnosis && session.cid_diagnosis.length > 0) {
        const cidLabels = session.cid_diagnosis.map((code) => getDiagnosisLabel(code, cidDiagnoses));
        narrative += `CID-10: ${cidLabels.join('; ')}. `;
      }
      narrative += `\n\n`;
    }
    
    if (session.notes) {
      narrative += `OBSERVAÇÕES ADICIONAIS\n\n${session.notes}\n\n`;
    }
    
    narrative += `CONCLUSÃO\n\n`;
    narrative += `Após a avaliação inicial, foi estabelecido o contrato terapêutico e acordado o início do processo de psicoterapia. `;
    narrative += `O(A) paciente demonstrou compreensão sobre os objetivos e a proposta de trabalho apresentados.\n\n`;
    
    narrative += `---\nRegistro realizado em conformidade com a Resolução CFP nº 001/2009.`;
    
    return narrative;
  }

  // Texto para sessões REGULARES e ENCERRAMENTO
  let narrative = `REGISTRO DE SESSÃO\n\n`;
  narrative += `Paciente: ${patient.name}\n`;
  narrative += `Data: ${date}\n`;
  narrative += `Horário: ${session.time}\n`;
  narrative += `Duração: ${session.duration_minutes} minutos\n`;
  narrative += `Modalidade: ${modality.charAt(0).toUpperCase() + modality.slice(1)}\n`;
  narrative += `Tipo: ${session.session_type === 'encerramento' ? 'Encerramento' : 'Sessão Regular'}\n\n`;
  
  narrative += `EVOLUÇÃO DO ATENDIMENTO\n\n`;
  
  narrative += `Na sessão realizada em ${date}, no formato ${modality}, foram abordadas questões relacionadas a ${topicsText}. `;
  
  narrative += `O(A) paciente apresentou humor ${moodText}, `;
  narrative += `com padrão de sono ${sleep} `;
  narrative += `e alimentação ${eating}. `;
  
  if (session.medication_status && session.medication_status !== 'sem-medicacao') {
    narrative += `Em relação à medicação, o(a) paciente relata que está ${medicationText}`;
    if (session.medication_new) {
      narrative += `, sendo a nova terapêutica: ${session.medication_new}`;
    }
    narrative += `. `;
  }
  
  narrative += `\n\nA intervenção foi conduzida sob a perspectiva da ${approach}`;
  
  if (session.techniques.length > 0) {
    narrative += `, utilizando-se as seguintes técnicas: ${formatTechniquesList(session.techniques)}`;
  }
  narrative += `. `;

  // Campos de evolução
  if (session.clinical_observations) {
    narrative += `\n\nObservações Clínicas: ${session.clinical_observations}`;
  }
  
  if (session.clinical_hypotheses) {
    narrative += `\n\nHipóteses Clínicas: ${session.clinical_hypotheses}`;
  }
  
  if (session.observed_progress) {
    narrative += `\n\nProgresso Observado: ${session.observed_progress}`;
  }
  
  if (session.interventions) {
    narrative += `\n\nIntervenções Realizadas: ${session.interventions}`;
  }

  // Encaminhamentos
  if (session.referral_needed && session.referral_to) {
    narrative += `\n\nENCAMINHAMENTO\n\n`;
    narrative += `Encaminhado para: ${session.referral_to}`;
    if (session.referral_reason) {
      narrative += `\nJustificativa: ${session.referral_reason}`;
    }
  }
  
  if ((session.dsm_diagnosis && session.dsm_diagnosis.length > 0) || 
      (session.cid_diagnosis && session.cid_diagnosis.length > 0)) {
    narrative += `\n\nCLASSIFICAÇÃO DIAGNÓSTICA\n\n`;
    
    if (session.dsm_diagnosis && session.dsm_diagnosis.length > 0) {
      const dsmLabels = session.dsm_diagnosis.map((code) => getDiagnosisLabel(code, dsmDiagnoses));
      narrative += `DSM-5-TR: ${dsmLabels.join('; ')}. `;
    }
    
    if (session.cid_diagnosis && session.cid_diagnosis.length > 0) {
      const cidLabels = session.cid_diagnosis.map((code) => getDiagnosisLabel(code, cidDiagnoses));
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
  const approach = session.approach ? getLabel(session.approach, therapyApproaches) : 'psicoterapia';
  const topicsText = session.topics.length > 0 ? formatTopicsList(session.topics) : 'temas terapêuticos';
  
  let report = `RELATÓRIO DE ATENDIMENTO PSICOLÓGICO\n\n`;
  report += `Paciente: ${patient.name}\n`;
  report += `Data do Atendimento: ${date}\n`;
  report += `Horário: ${session.time}\n`;
  report += `Duração: ${session.duration_minutes} minutos\n`;
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
