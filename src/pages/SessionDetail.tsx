import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';
import { generateSessionNarrative } from '@/utils/sessionNarrative';
import { PatientReportDialog } from '@/components/PatientReportDialog';
import { SessionDocuments } from '@/components/SessionDocuments';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Monitor,
  Moon,
  Heart,
  Utensils,
  Pill,
  Brain,
  Stethoscope,
  FileText,
  AlertTriangle,
  ScrollText,
  LayoutGrid,
  TrendingUp,
  ArrowRightLeft,
  Target,
  NotebookPen,
  ClipboardList,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  sleepPatterns,
  moods,
  eatingPatterns,
  medicationStatus,
  therapyApproaches,
  dsmDiagnoses,
  cidDiagnoses,
} from '@/data/psychologyData';

const sessionTypeLabels: Record<string, { label: string; color: string }> = {
  anamnese: { label: 'Anamnese', color: 'bg-primary text-primary-foreground' },
  regular: { label: 'Regular', color: 'bg-secondary text-secondary-foreground' },
  encerramento: { label: 'Encerramento', color: 'bg-destructive text-destructive-foreground' },
};

export default function SessionDetail() {
  const { patientId, sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPatient, sessions, deleteSession } = usePatients();

  const patient = getPatient(patientId!);
  const session = sessions.find((s) => s.id === sessionId);

  // Loading state
if ((!patient || !session) && (patientId || sessionId)) {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-64 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="h-10 w-full bg-muted animate-pulse rounded" />

        {/* Content skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="h-5 w-32 bg-muted animate-pulse rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/5 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
  if (!patient || !session) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">Sessão não encontrada</h2>
          <Button className="mt-6" asChild>
            <Link to={patientId ? `/patients/${patientId}` : '/patients'}>Voltar</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getLabel = (value: string, options: { value: string; label: string }[]) => {
    return options.find((o) => o.value === value)?.label || value;
  };

  const getDiagnosisLabel = (code: string, diagnoses: { code: string; name: string }[]) => {
    const diag = diagnoses.find((d) => d.code === code);
    return diag ? `${diag.code} - ${diag.name}` : code;
  };

  const handleDelete = () => {
    deleteSession(session.id);
    toast({
      title: 'Sessão removida',
      description: 'A sessão foi removida com sucesso.',
      variant: 'destructive',
    });
    navigate(`/patients/${patientId}`);
  };

  const isAnamnese = session.session_type === 'anamnese';
  const sessionTypeInfo = sessionTypeLabels[session.session_type] || sessionTypeLabels.regular;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/patients/${patientId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Paciente: {patient.name}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground capitalize">
                {formatDate(session.date)}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
                <Badge className={sessionTypeInfo.color}>
                  <ClipboardList className="mr-1 h-3 w-3" />
                  {sessionTypeInfo.label}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{session.time} ({session.duration_minutes} min)</span>
                </div>
                <Badge variant={session.modality === 'presencial' ? 'default' : 'secondary'}>
                  {session.modality === 'presencial' ? (
                    <MapPin className="mr-1 h-3 w-3" />
                  ) : (
                    <Monitor className="mr-1 h-3 w-3" />
                  )}
                  {session.modality === 'presencial' ? 'Presencial' : 'Online'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <PatientReportDialog session={session} patient={patient} />
            <Button variant="outline" asChild>
              <Link to={`/patients/${patientId}/sessions/${sessionId}/edit`}>
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover sessão?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O registro desta sessão será permanentemente removido.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Tabs for structured view and narrative */}
        <Tabs defaultValue="structured" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="structured" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Visualização Estruturada
            </TabsTrigger>
            <TabsTrigger value="narrative" className="gap-2">
              <ScrollText className="h-4 w-4" />
              Texto Corrido (CFP)
            </TabsTrigger>
          </TabsList>

          {/* Structured View */}
          <TabsContent value="structured">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Campos de Anamnese */}
              {isAnamnese && (
                <>
                  {session.main_complaint && (
                    <Card className="border-border bg-card shadow-card lg:col-span-2 border-l-4 border-l-primary">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <NotebookPen className="h-5 w-5 text-primary" />
                          Anamnese - Avaliação Inicial
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Queixa Principal</p>
                          <p className="mt-1 text-foreground whitespace-pre-wrap">{session.main_complaint}</p>
                        </div>
                        {session.complaint_history && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">História da Queixa</p>
                            <p className="mt-1 text-foreground whitespace-pre-wrap">{session.complaint_history}</p>
                          </div>
                        )}
                        {session.relevant_history && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Histórico Relevante</p>
                            <p className="mt-1 text-foreground whitespace-pre-wrap">{session.relevant_history}</p>
                          </div>
                        )}
                        {session.therapeutic_goals && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              Objetivos Terapêuticos
                            </p>
                            <p className="mt-1 text-foreground whitespace-pre-wrap">{session.therapeutic_goals}</p>
                          </div>
                        )}
                        {session.treatment_plan && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Plano de Tratamento</p>
                            <p className="mt-1 text-foreground whitespace-pre-wrap">{session.treatment_plan}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Questões Tratadas */}
              {session.topics.length > 0 && (
                <Card className="border-border bg-card shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      Questões Tratadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {session.topics.map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Estado Geral */}
              {(session.sleep_pattern || session.mood.length > 0 || session.eating) && (
                <Card className="border-border bg-card shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-primary" />
                      Estado Geral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.sleep_pattern && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Moon className="h-4 w-4" />
                          Sono
                        </div>
                        <p className="font-medium text-foreground">
                          {getLabel(session.sleep_pattern, sleepPatterns)}
                        </p>
                      </div>
                    )}
                    {session.mood.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          Humor
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {session.mood.map((m) => (
                            <Badge key={m} variant="outline">
                              {getLabel(m, moods)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {session.eating && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Utensils className="h-4 w-4" />
                          Alimentação
                        </div>
                        <p className="font-medium text-foreground">
                          {getLabel(session.eating, eatingPatterns)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Medicação */}
              {session.medication_status && (
                <Card className="border-border bg-card shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Pill className="h-5 w-5 text-primary" />
                      Medicação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-foreground">
                      {getLabel(session.medication_status, medicationStatus)}
                    </p>
                    {session.medication_new && (
                      <div className="mt-3 rounded-lg bg-secondary p-3">
                        <p className="text-sm text-muted-foreground">Nova terapêutica:</p>
                        <p className="mt-1 text-foreground">{session.medication_new}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Abordagem e Técnicas */}
              {session.approach && (
                <Card className="border-border bg-card shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-primary" />
                      Abordagem e Técnicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Abordagem</p>
                      <p className="font-semibold text-foreground">
                        {getLabel(session.approach, therapyApproaches)}
                      </p>
                    </div>
                    {session.techniques.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Técnicas Utilizadas</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {session.techniques.map((tech) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Evolução Clínica */}
              {(session.clinical_observations || session.clinical_hypotheses || session.observed_progress || session.interventions) && (
                <Card className="border-border bg-card shadow-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Evolução Clínica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.clinical_observations && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Observações Clínicas</p>
                        <p className="mt-1 text-foreground whitespace-pre-wrap">{session.clinical_observations}</p>
                      </div>
                    )}
                    {session.clinical_hypotheses && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Hipóteses Clínicas</p>
                        <p className="mt-1 text-foreground whitespace-pre-wrap">{session.clinical_hypotheses}</p>
                      </div>
                    )}
                    {session.observed_progress && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Progresso Observado</p>
                        <p className="mt-1 text-foreground whitespace-pre-wrap">{session.observed_progress}</p>
                      </div>
                    )}
                    {session.interventions && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Intervenções Realizadas</p>
                        <p className="mt-1 text-foreground whitespace-pre-wrap">{session.interventions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Encaminhamento */}
              {session.referral_needed && (
                <Card className="border-border bg-card shadow-card lg:col-span-2 border-l-4 border-l-warning">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ArrowRightLeft className="h-5 w-5 text-warning" />
                      Encaminhamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {session.referral_to && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Encaminhado para</p>
                        <p className="mt-1 text-foreground font-medium">{session.referral_to}</p>
                      </div>
                    )}
                    {session.referral_reason && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Justificativa</p>
                        <p className="mt-1 text-foreground whitespace-pre-wrap">{session.referral_reason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Diagnósticos */}
              {(session.dsm_diagnosis?.length > 0 || session.cid_diagnosis?.length > 0) && (
                <Card className="border-border bg-card shadow-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Classificação Diagnóstica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.dsm_diagnosis?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">DSM-5-TR</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {session.dsm_diagnosis.map((code) => (
                            <Badge key={code} variant="secondary">
                              {getDiagnosisLabel(code, dsmDiagnoses)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {session.cid_diagnosis?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">CID-10</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {session.cid_diagnosis.map((code) => (
                            <Badge key={code} variant="secondary">
                              {getDiagnosisLabel(code, cidDiagnoses)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Anexos (se houver) */}
{(() => {
  try {
    if (session.notes?.startsWith('__ATTACHMENTS__:')) {
      const [, attachmentsJson] = session.notes.split('|||');
      const attachments = JSON.parse(attachmentsJson);
      
      if (attachments.length > 0) {
        return (
          <Card className="border-border bg-card shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Anexos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attachments.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.type === 'application/pdf' && 'PDF'}
                        {file.type.startsWith('image/') && 'Imagem'}
                        {file.type.includes('word') && 'Documento Word'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      }
    }
  } catch (e) {
    // Se der erro ao processar anexos, não mostra nada
  }
  return null;
})()}

{/* Observações (texto limpo, sem código técnico) */}
{(() => {
  try {
    let displayNotes = session.notes;
    
   // Remove o código técnico dos anexos
if (displayNotes?.startsWith('__ATTACHMENTS__:')) {
  const parts = displayNotes.split('|||');
  displayNotes = parts[2] || ''; // Pega só o texto das observações
}

// Só mostra se tiver conteúdo
if (displayNotes && displayNotes.trim()) {
  return (
    <Card className="border-border bg-card shadow-card lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-foreground">{displayNotes}</p>
      </CardContent>
    </Card>
  );
}
} catch (e) {
  // Se der erro, mostra as notes originais
  if (session.notes) {
    return (
      <Card className="border-border bg-card shadow-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground">{session.notes}</p>
        </CardContent>
      </Card>
    );
  }
}
return null;
})()}
            </div>
          </TabsContent>

          {/* Narrative View */}
          <TabsContent value="narrative">
            <Card className="border-border bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ScrollText className="h-5 w-5 text-primary" />
                  Prontuário - Texto Corrido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-foreground leading-relaxed font-serif bg-secondary/30 p-6 rounded-lg border border-border">
                  {generateSessionNarrative(session, patient)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Documents Section */}
        <SessionDocuments sessionId={session.id} />
      </div>
    </Layout>
  );
}
