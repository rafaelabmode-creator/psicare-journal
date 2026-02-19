import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { Patient, Session, Profile } from '@/types';
import { FileDown, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generateSessionNarrative } from '@/utils/sessionNarrative';
import { therapyApproaches, techniquesByApproach, dsmDiagnoses, cidDiagnoses } from '@/data/psychologyData';

interface PatientRecordPDFProps {
  patient: Patient;
  sessions: Session[];
}

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  return options.find(o => o.value === value)?.label || value;
};

const getDiagnosisLabel = (code: string, diagnoses: { code: string; name: string }[]) => {
  const found = diagnoses.find(d => d.code === code);
  return found ? `${found.code} - ${found.name}` : code;
};

const getTechniqueLabel = (technique: string, approach: string | null) => {
  if (!approach) return technique;
  const techniques = techniquesByApproach[approach] || [];
  return techniques.includes(technique) ? technique : technique;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const statusLabels: Record<string, string> = {
  ativo: 'Ativo',
  alta: 'Alta',
  abandono: 'Abandono',
  encaminhado: 'Encaminhado',
  suspenso: 'Suspenso',
};

const sessionTypeLabels: Record<string, string> = {
  anamnese: 'Anamnese',
  regular: 'Regular',
  encerramento: 'Encerramento',
};

export function PatientRecordPDF({ patient, sessions }: PatientRecordPDFProps) {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();

  const generatePDF = async () => {
    if (!profile) {
      toast({
        title: 'Erro',
        description: 'Perfil do profissional não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = margin;

      const addHeader = () => {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(profile.full_name, pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Psicólogo(a) - CRP: ${profile.crp}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 4;
        
        if (profile.phone || profile.email) {
          const contactInfo = [profile.phone, profile.email].filter(Boolean).join(' | ');
          doc.text(contactInfo, pageWidth / 2, yPos, { align: 'center' });
          yPos += 4;
        }
        
        // Line separator
        yPos += 2;
        doc.setDrawColor(200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
      };

      const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
          addHeader();
        }
      };

      const addSection = (title: string) => {
        checkPageBreak(15);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(title, margin, yPos);
        yPos += 6;
        doc.setTextColor(0, 0, 0);
      };

      const addField = (label: string, value: string | null | undefined) => {
        if (!value) return;
        checkPageBreak(8);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}: `, margin, yPos);
        const labelWidth = doc.getTextWidth(`${label}: `);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(value, contentWidth - labelWidth);
        doc.text(lines[0], margin + labelWidth, yPos);
        if (lines.length > 1) {
          for (let i = 1; i < lines.length; i++) {
            yPos += 4;
            checkPageBreak(4);
            doc.text(lines[i], margin, yPos);
          }
        }
        yPos += 5;
      };

      const addParagraph = (text: string) => {
        checkPageBreak(10);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(text, contentWidth);
        for (const line of lines) {
          checkPageBreak(4);
          doc.text(line, margin, yPos);
          yPos += 4;
        }
        yPos += 2;
      };

      // Start document
      addHeader();

      // Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('PRONTUÁRIO PSICOLÓGICO', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      // Patient data section
      addSection('DADOS DO PACIENTE');
      addField('Nome', patient.name);
      addField('CPF', formatCPF(patient.cpf));
      addField('Data de Nascimento', `${formatDate(patient.birth_date)} (${calculateAge(patient.birth_date)} anos)`);
      addField('Status', statusLabels[patient.current_status] || patient.current_status);
      
      if (patient.phone) addField('Telefone', patient.phone);
      if (patient.email) addField('E-mail', patient.email);
      if (patient.profession) addField('Profissão', patient.profession);
      
      if (patient.address || patient.city) {
        const address = [patient.address, patient.city, patient.state, patient.zip_code]
          .filter(Boolean)
          .join(', ');
        addField('Endereço', address);
      }

      // Guardian info if minor
      if (patient.is_minor && patient.guardian_name) {
        yPos += 4;
        addSection('RESPONSÁVEL LEGAL');
        addField('Nome', patient.guardian_name);
        if (patient.guardian_cpf) addField('CPF', formatCPF(patient.guardian_cpf));
        if (patient.guardian_relationship) addField('Parentesco', patient.guardian_relationship);
        if (patient.guardian_phone) addField('Telefone', patient.guardian_phone);
      }

      yPos += 6;

      // Sessions
      addSection('HISTÓRICO DE ATENDIMENTOS');
      addParagraph(`Total de sessões registradas: ${sessions.length}`);
      yPos += 4;

      // Sort sessions by date (oldest first for chronological order)
      const sortedSessions = [...sessions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      for (let i = 0; i < sortedSessions.length; i++) {
        const session = sortedSessions[i];
        
        checkPageBreak(30);
        
        // Session header
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos - 4, contentWidth, 8, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(
          `Sessão ${i + 1} - ${formatDate(session.date)} - ${sessionTypeLabels[session.session_type] || session.session_type}`,
          margin + 2,
          yPos
        );
        yPos += 8;

        // Session details
        doc.setFontSize(9);
        addField('Horário', session.time);
        addField('Duração', `${session.duration_minutes} minutos`);
        addField('Modalidade', session.modality === 'presencial' ? 'Presencial' : 'Online');
        
        if (session.approach) {
          addField('Abordagem', getLabel(session.approach, therapyApproaches));
        }

        if (session.techniques && session.techniques.length > 0) {
          addField('Técnicas', session.techniques.join(', '));
        }

        if (session.topics && session.topics.length > 0) {
          addField('Temas Abordados', session.topics.join(', '));
        }

        if (session.mood && session.mood.length > 0) {
          addField('Humor', session.mood.join(', '));
        }

        if (session.sleep_pattern) addField('Padrão de Sono', session.sleep_pattern);
        if (session.eating) addField('Alimentação', session.eating);
        if (session.medication_status) addField('Medicação', session.medication_status);
        if (session.medication_new) addField('Nova Medicação', session.medication_new);

        // Anamnesis specific fields
        if (session.session_type === 'anamnese') {
          if (session.main_complaint) addField('Queixa Principal', session.main_complaint);
          if (session.complaint_history) addField('Histórico da Queixa', session.complaint_history);
          if (session.relevant_history) addField('Histórico Relevante', session.relevant_history);
          if (session.therapeutic_goals) addField('Objetivos Terapêuticos', session.therapeutic_goals);
          if (session.treatment_plan) addField('Plano de Tratamento', session.treatment_plan);
        }

        // Clinical observations
        if (session.clinical_observations) addField('Observações Clínicas', session.clinical_observations);
        if (session.clinical_hypotheses) addField('Hipóteses Clínicas', session.clinical_hypotheses);
        if (session.observed_progress) addField('Progresso Observado', session.observed_progress);
        if (session.interventions) addField('Intervenções', session.interventions);

        // Diagnoses
        if (session.dsm_diagnosis && session.dsm_diagnosis.length > 0) {
          const dsmLabels = session.dsm_diagnosis.map(d => getDiagnosisLabel(d, dsmDiagnoses)).join('; ');
          addField('Diagnóstico DSM-5', dsmLabels);
        }

        if (session.cid_diagnosis && session.cid_diagnosis.length > 0) {
          const cidLabels = session.cid_diagnosis.map(d => getDiagnosisLabel(d, cidDiagnoses)).join('; ');
          addField('Diagnóstico CID-11', cidLabels);
        }

        // Referral
        if (session.referral_needed) {
          addField('Encaminhamento', session.referral_to || 'Sim');
          if (session.referral_reason) addField('Motivo do Encaminhamento', session.referral_reason);
        }

        if (session.notes) addField('Anotações', session.notes);

        yPos += 6;
      }

      // Footer with signature line
      checkPageBreak(40);
      yPos += 10;
      doc.setDrawColor(150);
      doc.line(margin + 30, yPos, pageWidth - margin - 30, yPos);
      yPos += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(profile.full_name, pageWidth / 2, yPos, { align: 'center' });
      yPos += 4;
      doc.text(`CRP: ${profile.crp}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
        pageWidth / 2,
        yPos,
        { align: 'center' }
      );
      doc.text(
        'DOCUMENTO CONFIDENCIAL - Prontuário Psicológico conforme Resolução CFP nº 001/2009',
        pageWidth / 2,
        yPos + 4,
        { align: 'center' }
      );

      // Save the PDF
      const fileName = `prontuario_${patient.name.replace(/\s+/g, '_')}_${formatDate(new Date().toISOString())}.pdf`;
      doc.save(fileName);

      toast({
        title: 'PDF gerado com sucesso',
        description: 'O prontuário completo foi baixado.',
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error generating PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Não foi possível gerar o prontuário.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Exportar Prontuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Prontuário Completo</DialogTitle>
          <DialogDescription>
            Gere o prontuário completo do paciente em formato PDF, incluindo todos os dados cadastrais e o histórico de {sessions.length} sessões.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
            <p><strong>Paciente:</strong> {patient.name}</p>
            <p><strong>Status:</strong> {statusLabels[patient.current_status]}</p>
            <p><strong>Total de sessões:</strong> {sessions.length}</p>
            {sessions.length > 0 && (
              <p><strong>Período:</strong> {formatDate(sessions[sessions.length - 1].date)} a {formatDate(sessions[0].date)}</p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            O PDF incluirá o cabeçalho com seus dados profissionais (CRP), 
            todos os dados do paciente, e o registro completo de cada sessão em ordem cronológica.
          </p>

          <Button 
            onClick={generatePDF} 
            disabled={generating} 
            className="w-full gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Gerar e Baixar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
