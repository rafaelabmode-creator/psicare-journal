import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { PatientCard } from '@/components/PatientCard';
import { Users, FileText, Plus, Brain, Shield, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { patients, sessions, getPatientSessions, loading } = usePatients();
  
  const recentPatients = patients.slice(0, 3);
  const totalSessions = sessions.length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 text-primary-foreground shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold md:text-4xl">
              {profile?.full_name ? `Olá, ${profile.full_name.split(' ')[0]}!` : 'Bem-vindo ao PsiProntuário'}
            </h1>
            <p className="mt-2 max-w-2xl text-primary-foreground/90">
              Sistema de gestão de prontuários psicológicos em conformidade com as normas do Conselho Federal de Psicologia.
            </p>
            {profile?.crp && (
              <p className="mt-1 text-sm text-primary-foreground/70">
                CRP: {profile.crp}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/patients/new">
                  <Plus className="h-5 w-5" />
                  Novo Paciente
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/patients">
                  Ver Todos os Pacientes
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-foreground/5 blur-3xl" />
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Pacientes</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
                <p className="text-sm text-muted-foreground">Sessões Registradas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">CFP</p>
                <p className="text-sm text-muted-foreground">Em Conformidade</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {sessions.length > 0 ? new Date(sessions[0]?.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '—'}
                </p>
                <p className="text-sm text-muted-foreground">Última Sessão</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Cadastro de Pacientes</CardTitle>
              <CardDescription>
                Gerencie informações completas dos seus pacientes com segurança.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Registro de Sessões</CardTitle>
              <CardDescription>
                Documente cada sessão com todos os aspectos relevantes da psicoterapia.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Brain className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Técnicas e Diagnósticos</CardTitle>
              <CardDescription>
                Selecione técnicas por abordagem e registre diagnósticos DSM-5-TR e CID-10.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Recent Patients */}
        {patients.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Pacientes Recentes</h2>
              <Button variant="ghost" asChild>
                <Link to="/patients">Ver todos</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  onClick={() => navigate(`/patients/${patient.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {patients.length === 0 && (
          <Card className="border-dashed border-2 border-border bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Nenhum paciente cadastrado
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Comece cadastrando seu primeiro paciente para iniciar os registros de prontuário.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/patients/new">
                  <Plus className="h-4 w-4" />
                  Cadastrar Primeiro Paciente
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Index;
