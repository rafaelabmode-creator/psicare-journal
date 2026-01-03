import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePatients } from '@/hooks/usePatients';
import { PatientCard } from '@/components/PatientCard';
import { Plus, Search, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Patients() {
  const navigate = useNavigate();
  const { patients, loading } = usePatients();
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.cpf.includes(search)
  );

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
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">
              {patients.length} {patients.length === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'}
            </p>
          </div>
          <Button asChild>
            <Link to="/patients/new">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patient List */}
        {filteredPatients.length > 0 ? (
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => navigate(`/patients/${patient.id}`)}
              />
            ))}
          </div>
        ) : patients.length > 0 ? (
          <Card className="border-dashed border-2 border-border bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Nenhum resultado encontrado
              </h3>
              <p className="mt-2 text-muted-foreground">
                Tente buscar por outro nome ou CPF
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-border bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Nenhum paciente cadastrado
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Comece cadastrando seu primeiro paciente.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/patients/new">
                  <Plus className="h-4 w-4" />
                  Cadastrar Paciente
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
