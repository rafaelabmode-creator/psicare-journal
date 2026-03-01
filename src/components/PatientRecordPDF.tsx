import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { Patient, Session } from '@/types';
import { FileText, ArrowRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { therapyApproaches, dsmDiagnoses, cidDiagnoses } from '@/data/psychologyData';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

interface PatientRecordPDFProps {
  patient: Patient;
  sessions: Session[];
}

const statusLabels: Record<string, string> = {
  ativo: 'Ativo', alta: 'Alta', abandono: 'Abandono',
  encaminhado: 'Encaminhado', suspenso: 'Suspenso',
};
const sessionTypeLabels: Record<string, string> = {
  anamnese: 'Anamnese', regular: 'Regular', encerramento: 'Encerramento',
};
const modalityLabels: Record<string, string> = {
  presencial: 'Presencial', online: 'Online',
};
const getLabel = (value: string, options: { value: string; label: string }[]) =>
  options.find(o => o.value === value)?.label || value;
const getDiagLabel = (code: string, list: { code: string; name: string }[]) => {
  const f = list.find(d => d.code === code);
  return f ? `${f.code} - ${f.name}` : code;
};
const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');
const formatCPF = (cpf: string) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
const calculateAge = (bd: string) => {
  const today = new Date(); const b = new Date(bd);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
};

export function PatientRecordPDF({ patient, sessions }: PatientRecordPDFProps) {
  const [open, setOpen] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();

  const generatePDF = async () => {
    if (!profile) {
      toast({ title: 'Erro', description: 'Perfil não encontrado.', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    const now = new Date();
    const nowStr = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`;

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      const m = 20;
      const cw = pw - m * 2;
      let y = m;
      const tealR = 15, tealG = 118, tealB = 110; // #0F766E
      const tealLightR = 240, tealLightG = 253, tealLightB = 250; // #F0FDFA
      const totalPages = { count: 1 };
      let logoImg: HTMLImageElement | null = null;

      // Pre-load logo if available
      if (profile.logo_url) {
        try {
          logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = profile.logo_url!;
          });
        } catch {
          logoImg = null;
        }
      }

      const addHeader = () => {
        let headerY = m;
        
        if (logoImg) {
          const maxH = 15;
          const ratio = logoImg.width / logoImg.height;
          const imgH = maxH;
          const imgW = imgH * ratio;
          doc.addImage(logoImg, 'PNG', m, headerY, Math.min(imgW, 40), imgH);
          headerY += maxH + 3;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(profile.full_name, m, headerY + 4);
        headerY += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80);
        doc.text(`CRP: ${profile.crp}`, m, headerY + 4);
        headerY += 5;

        const contactParts = [profile.phone, profile.email].filter(Boolean);
        if (contactParts.length) {
          doc.text(contactParts.join(' | '), m, headerY + 4);
          headerY += 5;
        }

        if (profile.clinic_address) {
          doc.text(profile.clinic_address, m, headerY + 4);
          headerY += 5;
        }

        headerY += 2;
        doc.setDrawColor(tealR, tealG, tealB);
        doc.setLineWidth(0.5);
        doc.line(m, headerY, pw - m, headerY);
        headerY += 6;

        y = headerY;
      };

      const addFooter = (pageNum: number) => {
        const footerY = ph - 28;
        doc.setDrawColor(180);
        doc.setLineWidth(0.3);
        doc.line(m, footerY, pw - m, footerY);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);

        const footerLines = [
          `Este documento tem caráter sigiloso, conforme Resolução CFP nº 001/2009, e foi produzido`,
          `a pedido de ${patient.name}, com a seguinte finalidade: ${motivation}.`,
          `Foi entregue em entrevista devolutiva, conforme Art. 16 da Resolução CFP nº 006/2019.`,
          `O recebedor assume a responsabilidade pelo uso e pelo sigilo das informações aqui contidas.`,
          `A psicóloga não se responsabiliza por destinação diversa da declarada.`,
        ];

        let fy = footerY + 3;
        footerLines.forEach(line => {
          doc.text(line, pw / 2, fy, { align: 'center' });
          fy += 3;
        });

        fy += 1;
        doc.setFontSize(7);
        doc.text(`Documento gerado pelo PsiProntuário em ${nowStr} · Página ${pageNum} de {{TOTAL}}`, pw / 2, fy, { align: 'center' });
      };

      const maxContentY = ph - 32;

      const checkBreak = (needed: number) => {
        if (y + needed > maxContentY) {
          addFooter(totalPages.count);
          doc.addPage();
          totalPages.count++;
          addHeader();
        }
      };

      const addAutoTable = (head: string[][], body: string[][], sectionTitle?: string) => {
        if (sectionTitle) {
          checkBreak(15);
        }
        doc.autoTable({
          startY: y,
          head,
          body,
          margin: { left: m, right: m },
          theme: 'grid',
          headStyles: {
            fillColor: [tealLightR, tealLightG, tealLightB],
            textColor: [tealR, tealG, tealB],
            fontStyle: 'bold',
            fontSize: 9,
          },
          bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
          styles: {
            lineColor: [229, 231, 235],
            lineWidth: 0.3,
            cellPadding: 3,
          },
          columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
        });
        y = doc.lastAutoTable.finalY + 4;
      };

      // ====== START DOCUMENT ======
      addHeader();

      // Title
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(`PRONTUÁRIO PSICOLÓGICO — ${patient.name.toUpperCase()}`, pw / 2, y, { align: 'center' });
      y += 8;

      // Motivation box
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(m, y, cw, 16, 2, 2, 'FD');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60);
      doc.text(`Motivação para emissão: `, m + 4, y + 6);
      const motLabelW = doc.getTextWidth('Motivação para emissão: ');
      doc.setFont('helvetica', 'normal');
      const motLines = doc.splitTextToSize(motivation, cw - motLabelW - 8);
      doc.text(motLines[0] || '', m + 4 + motLabelW, y + 6);
      doc.setFont('helvetica', 'bold');
      doc.text(`Data de emissão: `, m + 4, y + 12);
      const dateLabelW = doc.getTextWidth('Data de emissão: ');
      doc.setFont('helvetica', 'normal');
      doc.text(nowStr, m + 4 + dateLabelW, y + 12);
      y += 22;

      // ====== FICHA DE IDENTIFICAÇÃO ======

      // Seção 1 — Dados Pessoais
      const personalData: string[][] = [
        ['Nome completo', patient.name],
        ['CPF', formatCPF(patient.cpf)],
        ['Data de nascimento', formatDate(patient.birth_date)],
        ['Idade', `${calculateAge(patient.birth_date)} anos`],
      ];
      if (patient.profession) personalData.push(['Profissão', patient.profession]);

      addAutoTable([['Dados Pessoais', '']], personalData);

      // Seção 2 — Contato
      const contactData: string[][] = [];
      if (patient.phone) contactData.push(['Telefone', patient.phone]);
      if (patient.email) contactData.push(['E-mail', patient.email]);
      if (patient.address) contactData.push(['Endereço', patient.address]);
      const cityParts = [patient.city, patient.state, patient.zip_code].filter(Boolean);
      if (cityParts.length) contactData.push(['Cidade / Estado / CEP', cityParts.join(' / ')]);

      if (contactData.length) {
        addAutoTable([['Contato', '']], contactData);
      }

      // Seção 3 — Responsável Legal
      if (patient.is_minor && patient.guardian_name) {
        const guardianData: string[][] = [
          ['Nome do responsável', patient.guardian_name],
        ];
        if (patient.guardian_cpf) guardianData.push(['CPF do responsável', formatCPF(patient.guardian_cpf)]);
        if (patient.guardian_phone) guardianData.push(['Telefone do responsável', patient.guardian_phone]);
        if (patient.guardian_relationship) guardianData.push(['Relação com o paciente', patient.guardian_relationship]);

        addAutoTable([['Responsável Legal', '']], guardianData);
      }

      // Seção 4 — Dados do Tratamento
      const sortedChronological = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const latestSession = sortedChronological.length > 0 ? sortedChronological[sortedChronological.length - 1] : null;
      const regularAndCloseSessions = sessions.filter(s => s.session_type === 'regular' || s.session_type === 'encerramento');

      const treatmentData: string[][] = [
        ['Status atual', statusLabels[patient.current_status] || patient.current_status],
      ];
      if (sortedChronological.length > 0) {
        treatmentData.push(['Data do primeiro atendimento', formatDate(sortedChronological[0].date)]);
      }
      treatmentData.push(['Total de sessões realizadas', String(regularAndCloseSessions.length)]);
      if (latestSession?.approach) {
        treatmentData.push(['Abordagem terapêutica', getLabel(latestSession.approach, therapyApproaches)]);
      }
      if (latestSession?.dsm_diagnosis && latestSession.dsm_diagnosis.length > 0) {
        treatmentData.push(['Diagnóstico DSM', latestSession.dsm_diagnosis.map(d => getDiagLabel(d, dsmDiagnoses)).join('; ')]);
      }
      if (latestSession?.cid_diagnosis && latestSession.cid_diagnosis.length > 0) {
        treatmentData.push(['Diagnóstico CID', latestSession.cid_diagnosis.map(d => getDiagLabel(d, cidDiagnoses)).join('; ')]);
      }

      addAutoTable([['Dados do Tratamento', '']], treatmentData);

      // ====== RESUMO DO CASO ======
      checkBreak(30);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(`RESUMO DO CASO — ${patient.name.toUpperCase()}`, pw / 2, y, { align: 'center' });
      y += 8;

      // Bloco 1 — Identificação resumida
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      const idLine = [patient.name, formatCPF(patient.cpf), formatDate(patient.birth_date), statusLabels[patient.current_status]].join(' | ');
      doc.text(idLine, m, y);
      y += 6;

      // Bloco 2 — Objetivos Terapêuticos
      const anamnese = sortedChronological.find(s => s.session_type === 'anamnese');
      checkBreak(12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('OBJETIVOS TERAPÊUTICOS', m, y);
      y += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      const goals = anamnese?.therapeutic_goals || 'Não registrado';
      const goalLines = doc.splitTextToSize(goals, cw);
      goalLines.forEach((line: string) => {
        checkBreak(5);
        doc.text(line, m, y);
        y += 4;
      });
      y += 4;

      // Bloco 3 — Evolução por Sessão
      checkBreak(10);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('HISTÓRICO DE SESSÕES', m, y);
      y += 6;

      if (sortedChronological.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100);
        doc.text('Nenhuma sessão registrada até o momento.', m, y);
        y += 6;
      } else {
        for (const session of sortedChronological) {
          checkBreak(25);

          // Session header line
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(tealR, tealG, tealB);
          const headerLine = `${formatDate(session.date)} — ${sessionTypeLabels[session.session_type]} — ${session.duration_minutes} min — ${modalityLabels[session.modality]}`;
          doc.text(headerLine, m, y);
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60);

          const addSessionField = (label: string, value: string | null | undefined) => {
            if (!value) return;
            checkBreak(5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40);
            const lbl = `${label}: `;
            doc.text(lbl, m, y);
            const lw = doc.getTextWidth(lbl);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60);
            const lines = doc.splitTextToSize(value, cw - lw);
            doc.text(lines[0], m + lw, y);
            for (let i = 1; i < lines.length; i++) {
              y += 4;
              checkBreak(4);
              doc.text(lines[i], m, y);
            }
            y += 5;
          };

          if (session.topics?.length) addSessionField('Temas', session.topics.join(', '));
          
          const stateItems: string[] = [];
          if (session.mood?.length) stateItems.push(`Humor: ${session.mood.join(', ')}`);
          if (session.sleep_pattern) stateItems.push(`Sono: ${session.sleep_pattern}`);
          if (session.eating) stateItems.push(`Alimentação: ${session.eating}`);
          if (stateItems.length) {
            checkBreak(5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60);
            doc.text(stateItems.join(' | '), m, y);
            y += 5;
          }

          if (session.medication_status) addSessionField('Medicação', session.medication_status);
          if (session.techniques?.length) addSessionField('Técnicas utilizadas', session.techniques.join(', '));
          if (session.observed_progress) addSessionField('Progresso observado', session.observed_progress);
          if (session.interventions) addSessionField('Intervenções realizadas', session.interventions);
          if (session.clinical_observations) addSessionField('Observações clínicas', session.clinical_observations);

          // Dashed separator
          checkBreak(4);
          doc.setDrawColor(200);
          doc.setLineDashPattern([2, 2], 0);
          doc.line(m, y, pw - m, y);
          doc.setLineDashPattern([], 0);
          y += 5;
        }
      }

      // Bloco 4 — Encerramento
      const closingSession = sortedChronological.find(s => s.session_type === 'encerramento');
      if (closingSession) {
        checkBreak(15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text('ENCERRAMENTO', m, y);
        y += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60);
        doc.text(`Data de encerramento: ${formatDate(closingSession.date)}`, m, y);
        y += 5;
        if (closingSession.clinical_observations) {
          const obsLines = doc.splitTextToSize(closingSession.clinical_observations, cw);
          obsLines.forEach((line: string) => {
            checkBreak(5);
            doc.text(line, m, y);
            y += 4;
          });
        }
        y += 4;
      }

      // Add footer to all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        addFooter(i);
      }

      // Replace {{TOTAL}} placeholder
      const pdfOutput = doc.output('arraybuffer');
      const uint8 = new Uint8Array(pdfOutput);
      const textDecoder = new TextDecoder('latin1');
      let pdfString = textDecoder.decode(uint8);
      pdfString = pdfString.replace(/\{\{TOTAL\}\}/g, String(pageCount));
      const textEncoder = new TextEncoder();
      // Re-encode back using latin1
      const finalArray = new Uint8Array(pdfString.length);
      for (let i = 0; i < pdfString.length; i++) {
        finalArray[i] = pdfString.charCodeAt(i);
      }
      const blob = new Blob([finalArray], { type: 'application/pdf' });

      const dateStr = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
      const fileName = `Prontuario_${patient.name.replace(/\s+/g, '_')}_${dateStr}.pdf`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);

      toast({ title: 'PDF gerado com sucesso', description: 'O prontuário foi baixado.' });
      setOpen(false);
      setMotivation('');
    } catch (error) {
      if (import.meta.env.DEV) console.error('PDF error:', error);
      toast({ title: 'Erro ao gerar PDF', description: 'Tente novamente.', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2 border-primary/50 text-primary hover:bg-primary/5"
        onClick={() => setOpen(true)}
      >
        <FileText className="h-4 w-4" />
        Exportar Prontuário em PDF
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emissão de Prontuário</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Informe a motivação para emissão deste documento. Essa informação será registrada no PDF.
          </p>
          <div className="space-y-2">
            <Label htmlFor="motivation">Motivação para emissão *</Label>
            <Textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Ex: Solicitação do paciente, encaminhamento médico, processo judicial, plano de saúde..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={generatePDF}
              disabled={!motivation.trim() || generating}
            >
              {generating ? 'Gerando...' : 'Gerar PDF'}
              {!generating && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
