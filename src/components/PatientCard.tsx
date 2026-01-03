import { Patient, TreatmentStatus } from '@/types';
import { Calendar, User, ChevronRight, Phone, Mail, MapPin, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

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

export function PatientCard({ patient, onClick }: PatientCardProps) {
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
    const numbers = cpf.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const age = calculateAge(patient.birth_date);

  return (
    <Card 
      className="group cursor-pointer border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/30"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {formatCPF(patient.cpf)}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${statusColors[patient.current_status]} border shrink-0`}
                >
                  <Activity className="h-3 w-3 mr-1" />
                  {statusLabels[patient.current_status]}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{age} anos</span>
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{patient.email}</span>
                  </div>
                )}
                {patient.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{patient.city}{patient.state ? `, ${patient.state}` : ''}</span>
                  </div>
                )}
              </div>

              {patient.profession && (
                <p className="text-sm text-muted-foreground">
                  Profissão: {patient.profession}
                </p>
              )}
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
