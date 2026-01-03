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

export default function SessionDetail() {
  const { patientId, sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPatient, sessions, deleteSession } = usePatients();

  const patient = getPatient(patientId!);
  const session = sessions.find((s) => s.id === sessionId);

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
              <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{session.time}</span>
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
              {/* Questões Tratadas */}
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

              {/* Estado Geral */}
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="h-5 w-5 text-primary" />
                    Estado Geral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Moon className="h-4 w-4" />
                      Sono
                    </div>
                    <p className="font-medium text-foreground">
                      {getLabel(session.sleepPattern, sleepPatterns)}
                    </p>
                  </div>
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
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Utensils className="h-4 w-4" />
                      Alimentação
                    </div>
                    <p className="font-medium text-foreground">
                      {getLabel(session.eating, eatingPatterns)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Medicação */}
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Pill className="h-5 w-5 text-primary" />
                    Medicação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-foreground">
                    {getLabel(session.medication.status, medicationStatus)}
                  </p>
                  {session.medication.newMedication && (
                    <div className="mt-3 rounded-lg bg-secondary p-3">
                      <p className="text-sm text-muted-foreground">Nova terapêutica:</p>
                      <p className="mt-1 text-foreground">{session.medication.newMedication}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Abordagem e Técnicas */}
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

              {/* Diagnósticos */}
              {(session.dsmDiagnosis?.length > 0 || session.cidDiagnosis?.length > 0) && (
                <Card className="border-border bg-card shadow-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Classificação Diagnóstica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.dsmDiagnosis?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">DSM-5-TR</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {session.dsmDiagnosis.map((code) => (
                            <Badge key={code} variant="secondary">
                              {getDiagnosisLabel(code, dsmDiagnoses)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {session.cidDiagnosis?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">CID-10</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {session.cidDiagnosis.map((code) => (
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

              {/* Observações */}
              {session.notes && (
                <Card className="border-border bg-card shadow-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-foreground">{session.notes}</p>
                  </CardContent>
                </Card>
              )}
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
      </div>
    </Layout>
  );
}
