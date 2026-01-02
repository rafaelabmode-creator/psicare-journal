import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatients } from '@/hooks/usePatients';
import { SessionCard } from '@/components/SessionCard';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  FileText,
  AlertTriangle
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

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPatient, getPatientSessions, deletePatient } = usePatients();
  
  const patient = getPatient(id!);
  const sessions = getPatientSessions(id!);

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

  const handleDelete = () => {
    deletePatient(patient.id);
    toast({
      title: 'Paciente removido',
      description: 'O paciente e todas as sessões foram removidos.',
      variant: 'destructive',
    });
    navigate('/patients');
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
                <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-muted-foreground">
                  <span className="font-mono text-sm">{formatCPF(patient.cpf)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(patient.birthDate)}</span>
                  </div>
                  <Badge variant="secondary">{calculateAge(patient.birthDate)} anos</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 sm:ml-auto">
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
                    Esta ação não pode ser desfeita. Isso removerá permanentemente o paciente e todas as {sessions.length} sessões registradas.
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

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
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
                  {sessions.length > 0 ? formatDate(sessions[0].date) : '—'}
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
                <p className="text-lg font-bold text-foreground">{formatDate(patient.createdAt)}</p>
                <p className="text-sm text-muted-foreground">Cadastrado em</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
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
      </div>
    </Layout>
  );
}
