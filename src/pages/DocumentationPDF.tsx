import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const sections = [
  {
    title: '1. Dados do Paciente',
    fields: [
      { name: 'Nome', desc: 'Nome completo do paciente' },
      { name: 'CPF', desc: 'Cadastro de Pessoa Física' },
      { name: 'Data de Nascimento', desc: 'Para cálculo de idade e verificação de menoridade' },
      { name: 'Endereço', desc: 'Logradouro completo' },
      { name: 'Cidade / Estado / CEP', desc: 'Localização geográfica' },
      { name: 'Telefone', desc: 'Contato telefônico' },
      { name: 'E-mail', desc: 'Contato eletrônico' },
      { name: 'Profissão', desc: 'Ocupação atual' },
      { name: 'É menor de idade?', desc: 'Flag que habilita campos do responsável legal' },
      { name: 'Nome do Responsável', desc: 'Obrigatório para pacientes menores de idade' },
      { name: 'CPF do Responsável', desc: 'Documento do responsável legal' },
      { name: 'Telefone do Responsável', desc: 'Contato do responsável legal' },
      { name: 'Relação com o Paciente', desc: 'Grau de parentesco ou relação com o menor' },
    ],
  },
  {
    title: '2. Status do Tratamento',
    fields: [
      { name: 'Ativo', desc: 'Paciente em atendimento regular' },
      { name: 'Alta', desc: 'Tratamento concluído com objetivos terapêuticos atingidos' },
      { name: 'Abandono', desc: 'Paciente deixou de comparecer sem comunicação prévia' },
      { name: 'Encaminhado', desc: 'Paciente direcionado a outro profissional ou serviço' },
      { name: 'Suspenso', desc: 'Tratamento temporariamente interrompido' },
    ],
    note: 'Cada mudança de status gera um registro histórico com motivo, observações e data da alteração.',
  },
  {
    title: '3. Sessão — Dados Gerais',
    fields: [
      { name: 'Tipo de Sessão', desc: 'Anamnese (primeira consulta), Regular ou Encerramento' },
      { name: 'Data', desc: 'Data em que a sessão ocorreu' },
      { name: 'Horário', desc: 'Hora de início do atendimento' },
      { name: 'Duração (minutos)', desc: 'Tempo total de atendimento' },
      { name: 'Modalidade', desc: 'Presencial ou Online' },
    ],
  },
  {
    title: '4. Estado Geral do Paciente',
    fields: [
      { name: 'Temas Abordados', desc: 'Lista de tópicos discutidos na sessão (20 opções pré-definidas incluindo Questões Familiares, Relacionamento, Trabalho, Autoestima, Traumas, Luto, Vícios, entre outros)' },
      { name: 'Padrão de Sono', desc: 'Normal, Dormindo Pouco, Dormindo Muito ou Insônia' },
      { name: 'Humor', desc: 'Seleção múltipla: Depressivo, Irritado, Melancólico, Raivoso, Alegre, Ansioso, Calmo, Apático, Eufórico' },
      { name: 'Alimentação', desc: 'Comendo Normal, Comendo Muito, Comendo Pouco ou Não Está Comendo' },
    ],
  },
  {
    title: '5. Medicação',
    fields: [
      { name: 'Status da Medicação', desc: 'Tomando regularmente, Irregular nos horários, Esquecendo dias, Parou por conta, Mudança na medicação ou Não utiliza medicação' },
      { name: 'Nova Medicação', desc: 'Campo livre para registrar medicação nova prescrita por psiquiatra' },
    ],
  },
  {
    title: '6. Abordagem Terapêutica e Técnicas',
    fields: [
      { name: 'Abordagem', desc: 'Terapia Cognitivo-Comportamental (TCC), Psicodinâmica, Humanista ou Análise do Comportamento' },
      { name: 'Técnicas Utilizadas', desc: 'Lista dinâmica de técnicas conforme a abordagem selecionada (ex.: Reestruturação Cognitiva, Questionamento Socrático, Associação Livre, Escuta Ativa, Análise Funcional, entre outras)' },
    ],
  },
  {
    title: '7. Diagnósticos',
    fields: [
      { name: 'Diagnóstico DSM', desc: 'Classificação pelo Manual Diagnóstico e Estatístico de Transtornos Mentais (19 opções incluindo F32 Episódio Depressivo, F41.1 TAG, F90 TDAH, entre outros)' },
      { name: 'Diagnóstico CID', desc: 'Classificação Internacional de Doenças — CID-10 (22 opções incluindo F32.0 Episódio depressivo leve, F41.1 Ansiedade generalizada, entre outros)' },
    ],
  },
  {
    title: '8. Evolução Clínica',
    fields: [
      { name: 'Observações Clínicas', desc: 'Registro descritivo do que foi observado durante a sessão' },
      { name: 'Hipóteses Clínicas', desc: 'Formulação de caso e hipóteses diagnósticas do profissional' },
      { name: 'Progresso Observado', desc: 'Evolução do paciente em relação aos objetivos terapêuticos estabelecidos' },
      { name: 'Intervenções Realizadas', desc: 'Descrição detalhada das intervenções aplicadas na sessão' },
    ],
  },
  {
    title: '9. Encaminhamentos',
    fields: [
      { name: 'Necessita Encaminhamento?', desc: 'Indicação de sim ou não para encaminhamento a outro profissional' },
      { name: 'Encaminhar Para', desc: 'Profissional ou especialidade de destino do encaminhamento' },
      { name: 'Motivo do Encaminhamento', desc: 'Justificativa clínica para o encaminhamento' },
    ],
  },
  {
    title: '10. Campos Específicos de Anamnese (Primeira Consulta)',
    fields: [
      { name: 'Queixa Principal', desc: 'Motivo que levou o paciente a buscar atendimento psicológico' },
      { name: 'Histórico da Queixa', desc: 'Evolução temporal e contexto detalhado da queixa apresentada' },
      { name: 'Histórico Relevante', desc: 'Antecedentes pessoais, familiares, médicos e psiquiátricos relevantes' },
      { name: 'Objetivos Terapêuticos', desc: 'Metas acordadas entre paciente e terapeuta para o processo terapêutico' },
      { name: 'Plano de Tratamento', desc: 'Estratégia terapêutica inicial definida pelo profissional' },
    ],
  },
  {
    title: '11. Observações Gerais',
    fields: [
      { name: 'Notas', desc: 'Campo livre para anotações adicionais do profissional sobre a sessão' },
    ],
  },
  {
    title: '12. Documentos da Sessão',
    fields: [
      { name: 'Tipo de Documento', desc: 'Classificação do documento anexado à sessão' },
      { name: 'Descrição', desc: 'Detalhamento sobre o conteúdo do documento' },
      { name: 'Arquivo', desc: 'Upload do arquivo digital associado' },
    ],
  },
  {
    title: '13. Dados do Profissional (Perfil)',
    fields: [
      { name: 'Nome Completo', desc: 'Nome do psicólogo responsável' },
      { name: 'CRP', desc: 'Número de registro no Conselho Regional de Psicologia' },
      { name: 'E-mail', desc: 'Contato profissional eletrônico' },
      { name: 'Telefone', desc: 'Contato telefônico profissional' },
    ],
  },
];

export default function DocumentationPDF() {
  const navigate = useNavigate();

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPageBreak = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
    };

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Estrutura do Prontuário Psicológico', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('PsiProntuário — Documentação Completa', margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 4;

    // Line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Intro
    doc.setFontSize(10);
    const introText = 'Este documento descreve todos os campos contemplados no prontuário psicológico do PsiProntuário, em conformidade com as normas do Conselho Federal de Psicologia (CFP). O sistema gera automaticamente uma narrativa clínica em texto corrido a partir dos dados preenchidos.';
    const introLines = doc.splitTextToSize(introText, contentWidth);
    checkPageBreak(introLines.length * 5 + 10);
    doc.text(introLines, margin, y);
    y += introLines.length * 5 + 8;

    // Sections
    for (const section of sections) {
      checkPageBreak(20);
      
      // Section title
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 80, 140);
      doc.text(section.title, margin, y);
      doc.setTextColor(0, 0, 0);
      y += 7;

      // Fields
      for (const field of section.fields) {
        const descLines = doc.splitTextToSize(field.desc, contentWidth - 8);
        checkPageBreak(descLines.length * 4.5 + 10);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`• ${field.name}`, margin + 4, y);
        y += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(descLines, margin + 8, y);
        doc.setTextColor(0, 0, 0);
        y += descLines.length * 4.5 + 3;
      }

      if (section.note) {
        checkPageBreak(12);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const noteLines = doc.splitTextToSize(section.note, contentWidth - 8);
        doc.text(noteLines, margin + 4, y);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        y += noteLines.length * 4.5 + 4;
      }

      y += 6;
    }

    // Footer note
    checkPageBreak(20);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const footerText = 'Conformidade: Toda a estrutura segue as normas do Conselho Federal de Psicologia (CFP) para a geração e manutenção de prontuários psicológicos, garantindo conformidade legal e técnica.';
    const footerLines = doc.splitTextToSize(footerText, contentWidth);
    doc.text(footerLines, margin, y);

    doc.save('PsiProntuario_Estrutura_Prontuario.pdf');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documentação do Prontuário</h1>
            <p className="text-sm text-muted-foreground">Estrutura completa de todos os campos</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={generatePDF} size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Baixar PDF da Documentação
          </Button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="rounded-lg border border-border bg-card p-5">
              <h2 className="mb-3 text-lg font-bold text-primary">{section.title}</h2>
              <div className="space-y-2">
                {section.fields.map((field) => (
                  <div key={field.name} className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-3 py-2">
                    <span className="text-sm font-semibold text-foreground">{field.name}</span>
                    <span className="text-sm text-muted-foreground">{field.desc}</span>
                  </div>
                ))}
              </div>
              {section.note && (
                <p className="mt-3 text-xs italic text-muted-foreground">{section.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
