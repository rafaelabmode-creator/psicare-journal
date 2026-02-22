import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatients } from '@/hooks/usePatients';
import { SessionCard } from '@/components/SessionCard';
import { PatientStatusDialog } from '@/components/PatientStatusDialog';
import { PatientRecordPDF } from '@/components/PatientRecordPDF';
import { TreatmentStatus } from '@/types';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  FileText,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Activity,
  Settings
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
import { useToast } from '@/hooks/use-toast';

const statusLabels: Record<TreatmentStatus, string> = {
  ativo: 'Ativo',
  alta: 'Alta',
  abandono: 'Abandono',
  encaminhado: 'Encaminhado',
  suspenso: 'Suspenso',
};

const statusColors: Record<TreatmentStatus, string> = {
  ativo: 'bg-green-500/10 text-green-700 border-green-200',
  alta: 'bg-blue-500/10 text-blue-700 border-blue-200',
  abandono: 'bg-red-500/10 text-red-700 border-red-200',
  encaminhado: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  suspenso: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPatient, getPatientSessions, deletePatient, loading, refetch } = usePatients();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  const patient = getPatient(id!);
  const sessions = getPatientSessions(id!);
  // Ordena sessões por data (mais recente primeiro)
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
    return dateB.getTime() - dateA.getTime();
  });
  if (loading) {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="h-5 w-32 bg-muted animate-pulse rounded mb-3" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Sessions list skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

  
  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">Paciente não encontrado</h2>
          <p className="mt-2 text-muted-foreground">O paciente que você está procurando não existe.</p>
          <Button className="mt-6" asChild>
            <Link to="/patients">Voltar para Pacientes</Link>
          </Button>
        </div>
      </Layout>
    );
  }

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

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleDelete = async () => {
    const { error } = await deletePatient(patient.id);
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o paciente.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Paciente removido',
        description: 'O paciente e todas as sessões foram removidos.',
        variant: 'destructive',
      });
      navigate('/patients');
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/patients">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
                  <Badge 
                    variant="outline" 
                    className={`${statusColors[patient.current_status]} border cursor-pointer hover:opacity-80`}
                    onClick={() => setStatusDialogOpen(true)}
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    {statusLabels[patient.current_status]}
                    <Settings className="h-3 w-3 ml-1" />
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-muted-foreground">
                  <span className="font-mono text-sm">{formatCPF(patient.cpf)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(patient.birth_date)}</span>
                  </div>
                  <Badge variant="secondary">{calculateAge(patient.birth_date)} anos</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <PatientRecordPDF patient={patient} sessions={sessions} />
            <Button variant="outline" asChild>
              <Link to={`/patients/${patient.id}/edit`}>
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover paciente?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso removerá permanentemente o paciente e todas as {sortedSessions.length} sessões registradas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Patient Info */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {patient.phone && (
            <Card className="border-border bg-card shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium text-foreground">{patient.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {patient.email && (
            <Card className="border-border bg-card shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium text-foreground truncate">{patient.email}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {patient.city && (
            <Card className="border-border bg-card shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-medium text-foreground">{patient.city}{patient.state ? `, ${patient.state}` : ''}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {patient.profession && (
            <Card className="border-border bg-card shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Profissão</p>
                  <p className="font-medium text-foreground">{patient.profession}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{sortedlength}</p>
                <p className="text-sm text-muted-foreground">Sessões</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {sortedSessions.length > 0 ? formatDate(sessions[0].date) : '—'}
                </p>
                <p className="text-sm text-muted-foreground">Última Sessão</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatDate(patient.created_at)}</p>
                <p className="text-sm text-muted-foreground">Cadastrado em</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guardian Info (if minor) */}
        {patient.is_minor && patient.guardian_name && (
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Responsável Legal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium text-foreground">{patient.guardian_name}</p>
              </div>
              {patient.guardian_relationship && (
                <div>
                  <p className="text-sm text-muted-foreground">Parentesco</p>
                  <p className="font-medium text-foreground">{patient.guardian_relationship}</p>
                </div>
              )}
              {patient.guardian_cpf && (
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-mono text-foreground">{formatCPF(patient.guardian_cpf)}</p>
                </div>
              )}
              {patient.guardian_phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium text-foreground">{patient.guardian_phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sessions */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Sessões</CardTitle>
              <CardDescription>Histórico de atendimentos do paciente</CardDescription>
            </div>
            <Button asChild>
              <Link to={`/patients/${patient.id}/sessions/new`}>
                <Plus className="h-4 w-4" />
                Nova Sessão
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {sortedSessions.length > 0 ? (
              <div className="space-y-3">
                {sortedSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => navigate(`/patients/${patient.id}/sessions/${session.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Nenhuma sessão registrada
                </h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Registre a primeira sessão de atendimento deste paciente.
                </p>
                <Button className="mt-6" asChild>
                  <Link to={`/patients/${patient.id}/sessions/new`}>
                    <Plus className="h-4 w-4" />
                    Registrar Primeira Sessão
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Dialog */}
        <PatientStatusDialog
          open={statusDialogOpen}
          onOpenChange={(open) => {
            setStatusDialogOpen(open);
            if (!open) refetch();
          }}
          patientId={patient.id}
          currentStatus={patient.current_status}
        />
      </div>
    </Layout>
  );
}
